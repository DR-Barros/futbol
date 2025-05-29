import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import json
import os

class CameraClassifier:
    """
    Classifier for camera types in football matches using a pre-trained ResNet model.
    This classifier predicts the type of camera based on images taken during football matches.
    It supports both single predictions and probability distributions over all classes.
    """
    def __init__(self, model_path: str):
        """
        Initialize the CameraClassifier with the model path.
        :param model_path: Path to the pre-trained model file.
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.class_names = ['close-up_behind_the_goal', 'close-up_corner', 'close-up_player_or_field_referee', 'close-up_side_staff', 'goal_line_technology_camera', 'inside_the_goal', 'main_behind_the_goal', 'main_camera_center', 'main_camera_left', 'main_camera_right', 'other', 'public', 'spider_camera']
        self.num_classes = len(self.class_names)
        
        # Definir transformaciones (usa las mismas de validación)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])
        
        # Cargar modelo
        self.model = models.resnet18(weights='IMAGENET1K_V1')
        self.model.fc = nn.Linear(self.model.fc.in_features, self.num_classes)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()

    def predict(self, image_path: str) -> str:
        """
        Predict the camera type from an image.
        :param image_path: Path to the image file.
        :return: Predicted camera type as a string.
        """
        image = Image.open(image_path).convert('RGB')
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            output = self.model(input_tensor)
            predicted_index = output.argmax(dim=1).item()
        
        return self.class_names[predicted_index]

    def predict_proba(self, image_path: str) -> dict:
        """
        Predict the probability distribution of camera types from an image.
        :param image_path: Path to the image file.
        :return: Dictionary with camera types as keys and their probabilities as values.
        """
        image = Image.open(image_path).convert('RGB')
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            output = self.model(input_tensor)
            probabilities = torch.nn.functional.softmax(output, dim=1).squeeze().cpu().numpy()
        
        return dict(zip(self.class_names, probabilities))
