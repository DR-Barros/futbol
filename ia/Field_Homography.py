from CameraClassifier import CameraClassifier
from ultralytics import YOLO
import cv2
import torch
import numpy as np


class FieldHomography:
    """
    Clase para detectar líneas del campo de fútbol y jugadores, homologar posiciones y clasificar cámaras.
    Esta clase utiliza modelos YOLO para detectar jugadores, líneas del campo y cámaras, y proporciona métodos para obtener la homografía del campo y las posiciones homologadas de los jugadores y el balón.
    Atributos:
        model_players_ball_path (str): Ruta al modelo YOLO para detectar jugadores y balón.
        model_line_path (str): Ruta al modelo YOLO para detectar líneas del campo.
        model_inclination_path (str): Ruta al modelo YOLO para detectar inclinaciones de líneas.
        model_camera_path (str): Ruta al modelo de clasificación de cámaras.
        field_width (float): Ancho del campo de fútbol en metros.
        field_length (float): Largo del campo de fútbol en metros.
    """
    def __init__(self, model_players_ball_path: str, model_line_path: str, model_inclination_path: str, model_camera_path: str, field_width: float = 68.0, field_length: float = 105.0):
        """
        Inicializa la clase FieldHomography con los modelos y dimensiones del campo.
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
    
    def predict_players_ball(self, frame, verbose=False):
        results = self.model_players_ball(frame, device=self.device)
        positions = []
        index = 0
        for result in results:
            boxes = result.boxes.xyxy.cpu().numpy()
            for box in boxes:
                cls_id = int(box.cls[0])  
                if self.model_players_ball.names[cls_id] not in ['person', 'sports ball']:
                    continue
                x1, y1, x2, y2 = box
                if verbose:
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0) if self.model_players_ball.names[cls_id] == 'person' else (0, 255, 0), 2)
                    cv2.putText(frame, self.model_players_ball.names[cls_id] + f" {index}", (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                center_x = (x1 + x2) / 2
                positions.append({
                    "id": index,
                    "class": self.model_players_ball.names[cls_id],
                    "position": (center_x, max(y1, y2)),
                })
                index += 1
        return positions
    
    def predict_lines(self, frame, verbose=False):
        inclination_results = []
        for result in self.model_inclination(frame, device=self.device):
            boxes = result.boxes.xyxy.cpu().numpy()
            for box in boxes:
                x1, y1, x2, y2 = box
                if self.model_inclination.names[int(box.cls[0])] == "unknown":
                    continue
                inclination_results.append({
                    "pos": (x1, y1, x2, y2),
                    "type": self.model_inclination.names[int(box.cls[0])],
                })
        field_lines = []
        central_circle = None
        for result in self.model_line(frame, device=self.device):
            boxes = result.boxes.xyxy.cpu().numpy()
            for box in boxes:
                cls_id = int(box.cls[0])
                line_name = self.model_line.names[cls_id]
                if line_name == "central circle":
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
                    if verbose:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 1)
                    central_circle = [x1, y1, x2, y2]
                elif line_name in [ 'Circle right','Circle left', "Goal right crossbar","Goal right post left","Goal right post right","Goal left post left","Goal left post left ","Goal left post left","Goal left post right","Goal left crossbar", 'unknown']:
                    pass
                else:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
                    # Buscar la inclinación_box con mayor área de intersección
                    max_iou = 0
                    best_inclinacion = None
                    for inc_box in inclination_results:
                        ix1, iy1, ix2, iy2 = inc_box["pos"]
                        # calcular intersección
                        inter_x1 = max(x1, ix1)
                        inter_y1 = max(y1, iy1)
                        inter_x2 = min(x2, ix2)
                        inter_y2 = min(y2, iy2)
                        inter_w = max(0, inter_x2 - inter_x1)
                        inter_h = max(0, inter_y2 - inter_y1)
                        inter_area = inter_w * inter_h
                        area_line = (x2 - x1) * (y2 - y1)
                        area_inc = (ix2 - ix1) * (iy2 - iy1)
                        union_area = area_line + area_inc - inter_area
                        iou = inter_area / union_area if union_area > 0 else 0
                        if iou > max_iou:
                            max_iou = iou
                            best_inclinacion = inc_box
                    # Si hay inclinación asociada, usar su sentido
                    if best_inclinacion is not None:
                        sentido = best_inclinacion["type"]
                        if sentido == "r":
                            if verbose:
                                cv2.line(frame, (x1, y2), (x2, y1), (0, 255, 0), 2)
                            field_lines.append({"pos":(x1, y2, x2, y1),"type": line_name})
                        else:
                            if verbose:
                                cv2.line(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                            field_lines.append({"pos":(x1, y1, x2, y2),"type": line_name})
                    else:
                        #ponemos un rectangulo en la posicion de la linea
                        roi = frame[y1:y2, x1:x2]
                        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
                        if verbose:
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
                        blurred_roi = cv2.GaussianBlur(gray_roi, (5, 5), 0)
                        # Aplicar Canny para detectar bordes
                        edges = cv2.Canny(blurred_roi, 50, 150)
                        # mostrar los bordes
                        lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi/180, threshold=50, minLineLength=20, maxLineGap=10)
                        if lines is not None:
                            long_line = 0
                            longest_line = None
                            for line in lines:
                                x1_l, y1_l, x2_l, y2_l = line[0]
                                line_length = np.sqrt((x2_l - x1_l) ** 2 + (y2_l - y1_l) ** 2)
                                if line_length > long_line:
                                    long_line = line_length
                                    longest_line = (x1_l, y1_l, x2_l, y2_l)
                            if longest_line is not None:
                                x1_line, y1_line, x2_line, y2_line = longest_line
                                cv2.line(frame, (x1 + x1_line, y1 + y1_line), (x1 + x2_line, y1 + y2_line), (0, 255, 255), 2)
                                angle_rad = np.arctan2((y2_line - y1_line), (x2_line - x1_line))
                                angle_deg = np.degrees(angle_rad)
                                if angle_deg > 0:
                                    cv2.line(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                                    field_lines.append({"pos":(x1, y1, x2, y2),"type": line_name})
                                else:
                                    cv2.line(frame, (x1, y2), (x2, y1), (0, 255, 0), 2)
                                    field_lines.append({"pos":(x1, y2, x2, y1),"type": line_name})
                        if verbose:
                            cv2.putText(frame, line_name, (x1, y1 + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
        return field_lines, central_circle  
    def predict_camera(self, frame):
        results = self.model_camera.predict_frame(frame)
        return results
    
    def get_homolography(self, field_lines, central_circle):
        """
        Obtiene la homografía del campo a partir de las líneas detectadas y el círculo central.
        Args:
            field_lines (list): Lista de líneas del campo.
            central_circle (list): Coordenadas del círculo central.
        Returns:
            np.ndarray: Matriz de homografía.
        """
        pass
        

    def get_player_ball_homolography_positions(self, positions, H):
        """
        Obtiene las posiciones homologadas de los jugadores y el balón.
        Args:
            positions (list): Lista de posiciones de los jugadores y el balón.
            H (np.ndarray): Matriz de homografía.
        Returns:
            list: Lista de posiciones homologadas.
        """
        if H is None:
            raise ValueError("Homography matrix H is not defined.")
        homologated_positions = []
        for pos in positions:
            try:
                point = np.array([pos["pos"][0], pos["pos"][1], 1], dtype=np.float32)
                transformed_point = np.dot(H, point)
                transformed_point /= transformed_point[2]  # Normalizarq
                homologated_positions.append({"pos":(transformed_point[0], transformed_point[1]),"type": pos["type"], "index": pos["index"]})
            except Exception as e:
                print(f"Error al aplicar homografía a la posición {pos['index']}: {e}")
                continue
        return homologated_positions
    
    def get_frame_homolography(self, frame, H):
        """
        Aplica la homografía a un frame.
        Args:
            frame (np.ndarray): Imagen del frame.
            H (np.ndarray): Matriz de homografía.
        Returns:
            array: Imagen transformada.
        """
        if H is None:
            raise ValueError("Homography matrix H is not defined.")
        h_img, w_img = frame.shape[:2]
        img_corners = np.array([
            [0, 0, 1],
            [w_img-1, 0, 1],
            [w_img-1, h_img-1, 1],
            [0, h_img-1, 1]
        ], dtype=np.float32)
        transformed_corners = np.dot(H, img_corners.T).T
        transformed_corners /= transformed_corners[:, 2].reshape(-1, 1)
        transformed_corners = transformed_corners[:, :2].astype(np.int32)
        min_x = np.min(transformed_corners[:, 0])
        min_y = np.min(transformed_corners[:, 1])
        max_x = np.max(transformed_corners[:, 0])
        max_y = np.max(transformed_corners[:, 1])
        return [min_x, min_y, max_x, max_y]