from CameraClassifier import CameraClassifier
from ultralytics import YOLO
import cv2
import torch
import numpy as np


class FieldHomography:
    def __init__(self, model_players_ball_path: str, model_line_path: str, model_inclination_path: str, model_camera_path: str, field_width: float = 68.0, field_length: float = 105.0):
        """
        """
        self.model_players_ball = YOLO(model_players_ball_path)
        self.model_line = YOLO(model_line_path)
        self.model_inclination = YOLO(model_inclination_path)
        self.model_camera = CameraClassifier(model_camera_path)
        self.field_map = {
            #Lineas de borde
            "Side line left":     (0, 0, 0, field_width),
            "Side line right":    (field_length, 0, field_length, field_width),
            "Side line top":      (0, field_width, field_length, field_width),
            "Side line bottom":   (0, 0, field_length, 0),
            "Middle line":      (field_length / 2, 0, field_length / 2, field_width),
            # CÍRCULOS
            "Circle central":     {"center": (field_length / 2, field_width / 2), "radius": 9.15},
            
            # ÁREA GRANDE IZQUIERDA
            "Big rect. left main":  (16.5, field_width/2 - 20.16, 16.5, field_width/2 + 20.16),
            "Big rect. left top":   (0, field_width/2 + 20.16, 16.5, field_width/2 + 20.16),
            "Big rect. left bottom":(0, field_width/2 - 20.16, 16.5, field_width/2 - 20.16),
            
            # ÁREA GRANDE DERECHA
            "Big rect. right main": (field_length - 16.5, field_width/2 - 20.16, field_length - 16.5, field_width/2 + 20.16),
            "Big rect. right top":  (field_length, field_width/2 + 20.16, field_length - 16.5, field_width/2 + 20.16),
            "Big rect. right bottom":(field_length, field_width/2 - 20.16, field_length - 16.5, field_width/2 - 20.16),
            
            # ÁREA PEQUEÑA IZQUIERDA
            "Small rect. left main":   (5.5, field_width/2 - 9.16, 5.5, field_width/2 + 9.16),
            "Small rect. left top":    (0, field_width/2 + 9.16, 5.5, field_width/2 + 9.16),
            "Small rect. left bottom": (0, field_width/2 - 9.16, 5.5, field_width/2 - 9.16),
            # ÁREA PEQUEÑA DERECHA
            "Small rect. right main":  (field_length - 5.5, field_width/2 - 9.16, field_length - 5.5, field_width/2 + 9.16),
            "Small rect. right top":   (field_length, field_width/2 + 9.16, field_length - 5.5, field_width/2 + 9.16),
            "Small rect. right bottom":(field_length, field_width/2 - 9.16, field_length - 5.5, field_width/2 - 9.16),
        }
        self.circle_points =  {
             "Circle central": (field_length / 2, field_width / 2),
            "Circle central left": (field_length / 2 - 9.15, field_width / 2),
            "Circle central right": (field_length / 2 + 9.15, field_width / 2),
            "Circle central top": (field_length / 2, field_width / 2 + 9.15),
            "Circle central bottom": (field_length / 2, field_width / 2 - 9.15),
        }
        self.real_intersection_points = {
            "Side line left": {
                "Side line bottom": (0.0, 0.0),
                "Side line top": (0.0, field_width),
            },
            "Side line right": {
                "Side line bottom": (field_length, 0.0),
                "Side line top": (field_length, field_width),
            },
            "Side line top": {
                "Side line left": (0.0, field_width),
                "Side line right": (field_length, field_width),
            },
            "Side line bottom": {
                "Side line left": (0.0, 0.0),
                "Side line right": (field_length, 0.0),
            },
            "Middle line": {
                "Side line bottom": (field_length / 2, 0.0),
                "Side line top": (field_length / 2, field_width),
            },
            "Big rect. left main": {
                "Big rect. left bottom": (16.5, field_width / 2 - 20.16),
                "Big rect. left top": (16.5, field_width / 2 + 20.16),
            },
            "Big rect. left top": {
                "Big rect. left main": (16.5, field_width / 2 + 20.16),
                "Side line left": (0.0, field_width / 2 + 20.16),
            },
            "Big rect. left bottom": {
                "Big rect. left main": (16.5, field_width / 2 - 20.16),
                "Side line left": (0.0, field_width / 2 - 20.16),
            },
            "Big rect. right main": {
                "Big rect. right bottom": (field_length - 16.5, field_width / 2 - 20.16),
                "Big rect. right top": (field_length - 16.5, field_width / 2 + 20.16),
            },
            "Big rect. right top": {
                "Big rect. right main": (field_length - 16.5, field_width / 2 + 20.16),
                "Side line right": (field_length, field_width / 2 + 20.16),
            },
            "Big rect. right bottom": {
                "Big rect. right main": (field_length - 16.5, field_width / 2 - 20.16),
                "Side line right": (field_length, field_width / 2 - 20.16),
            },
            "Small rect. left main": {
                "Small rect. left bottom": (5.5, field_width / 2 - 9.16),
                "Small rect. left top": (5.5, field_width / 2 + 9.16),
            },
            "Small rect. left top": {
                "Small rect. left main": (5.5, field_width / 2 + 9.16),
                "Side line left": (0.0, field_width / 2 + 9.16),
            },
            "Small rect. left bottom": {
                "Small rect. left main": (5.5, field_width / 2 - 9.16),
                "Side line left": (0.0, field_width / 2 - 9.16),
            },
            "Small rect. right main": {
                "Small rect. right bottom": (field_length - 5.5, field_width / 2 - 9.16),
                "Small rect. right top": (field_length - 5.5, field_width / 2 + 9.16),
            },
            "Small rect. right top": {
                "Small rect. right main": (field_length - 5.5, field_width / 2 + 9.16),
                "Side line right": (field_length, field_width / 2 + 9.16),
            },
            "Small rect. right bottom": {
                "Small rect. right main": (field_length - 5.5, field_width / 2 - 9.16),
                "Side line right": (field_length, field_width / 2 - 9.16),
            },
        }
        self.field_lines_map = []
        for name, coords in self.field_map.items():
            if isinstance(coords, tuple):
                x1, y1, x2, y2 = coords
                self.field_line_map.append(self.segment_to_line(x1, y1, x2, y2, name))
        
        frames = {
            'close-up_behind_the_goal': {
                "correct": 0,
                "total": 0
            },
            'close-up_corner': {
                "correct": 0,
                "total": 0
            },
            'close-up_player_or_field_referee': {
                "correct": 0,
                "total": 0
            },
            'close-up_side_staff': {
                "correct": 0,
                "total": 0
            },
            'goal_line_technology_camera': {
                "correct": 0,
                "total": 0
            },
            'inside_the_goal': {
                "correct": 0,
                "total": 0
            },
            'main_behind_the_goal': {
                "correct": 0,
                "total": 0
            },
            'main_camera_center': {
                "correct": 0,
                "total": 0
            },
            'main_camera_left': {
                "correct": 0,
                "total": 0
            },
            'main_camera_right': {
                "correct": 0,
                "total": 0
            },
            'other': {
                "correct": 0,
                "total": 0
            },
            'public': {
                "correct": 0,
                "total": 0
            },
            'spider_camera': {
                "correct": 0,
                "total": 0
            }
        }
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            
    def segment_to_line(x1, y1, x2, y2, name):
        """Convierte un segmento de línea en la forma Ax + By + C = 0."""
        A = y2 - y1
        B = x1 - x2
        C = x2 * y1 - x1 * y2
        return A, B, -C, name

    def intersection(line1, line2):
        A1, B1, C1, NAME1 = line1
        A2, B2, C2, NAME2 = line2
        D = A1 * B2 - A2 * B1
        if D == 0:
            return None  # Son paralelas
        x = (B2 * C1 - B1 * C2) / D
        y = (A1 * C2 - A2 * C1) / D
        return x, y, NAME1, NAME2
    
    def predict_players_ball(self, frame):
        results = self.model_players_ball(frame, device=self.device)
        return results
    
    def predict_lines(self, frame):
        results = self.model_line(frame, device=self.device)
        return results
    def predict_inclination(self, frame):
        results = self.model_inclination(frame, device=self.device)
        return results
    def predict_camera(self, frame):
        results = self.model_camera.predict_frame(frame)
        return results
        