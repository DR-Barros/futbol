from statsbombpy import sb
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt

events = sb.events(match_id=3939985, split=True)

eventos = []
for event in events:
    eventos.append(event)
eventos.pop(0)

data = []
for event in eventos:
    try:
        evento = events[event]
        if not ("location" in evento.columns):
            evento["location"] = None
        data.append(evento[["period", "timestamp", "type", "location", "team",]])
    except Exception as e:
        print(f"{event} fallo por {e}")

data = pd.concat(data)

#ordenamos por periodo y tiempo
data = data.sort_values(by=["period", "timestamp"])
data = data.reset_index(drop=True)

#obtenemos los equipos
teams = data["team"].unique()
#obtenemos el equipo local
home_team = teams[0]
#obtenemos el equipo visitante
away_team = teams[1]

# Activamos modo interactivo
plt.ion()

fig, ax = plt.subplots()
sc = ax.scatter([], [])
ax.set_xlim(-10, 130)
ax.set_ylim(-10, 90)

# Dibujamos las líneas del campo de fútbol
# Líneas exteriores
ax.plot([0, 0], [0, 80], color="black")  # Línea izquierda
ax.plot([120, 120], [0, 80], color="black")  # Línea derecha
ax.plot([0, 120], [0, 0], color="black")  # Línea superior
ax.plot([0, 120], [80, 80], color="black")  # Línea inferior

# Línea central
ax.plot([60, 60], [0, 80], color="black")  # Línea central

# Círculo central
circle = plt.Circle((60, 40), 9.15, color="black", fill=False)
ax.add_artist(circle)

# Área penal del equipo local
ax.plot([0, 16.5], [18, 18], color="black")  # Línea superior
ax.plot([0, 16.5], [62, 62], color="black")  # Línea inferior
ax.plot([16.5, 16.5], [18, 62], color="black")  # Línea vertical

# Área penal del equipo visitante
ax.plot([120, 103.5], [18, 18], color="black")  # Línea superior
ax.plot([120, 103.5], [62, 62], color="black")  # Línea inferior
ax.plot([103.5, 103.5], [18, 62], color="black")  # Línea vertical

# Área chica del equipo local
ax.plot([0, 5.5], [30, 30], color="black")  # Línea superior
ax.plot([0, 5.5], [50, 50], color="black")  # Línea inferior
ax.plot([5.5, 5.5], [30, 50], color="black")  # Línea vertical

# Área chica del equipo visitante
ax.plot([120, 114.5], [30, 30], color="black")  # Línea superior
ax.plot([120, 114.5], [50, 50], color="black")  # Línea inferior
ax.plot([114.5, 114.5], [30, 50], color="black")  # Línea vertical

# Punto penal del equipo local
ax.scatter(11, 40, color="black")  # Punto penal

# Punto penal del equipo visitante
ax.scatter(109, 40, color="black")  # Punto penal

def update(row):
    if row["location"] is None:
        ax.set_title(f"Periodo: {row['period']} | Tiempo: {row['timestamp']}s")
        plt.draw()
        plt.pause(0.1)
        return
    
    x = row["location"][0] 
    y = row["location"][1] 
    positions = np.array([[x, y]])

    if not np.isnan(x) and not np.isnan(y):
        if row["team"] == home_team:
            adjusted_positions = np.array([[x, y]]) if row["period"] == 1 else np.array([[120 - x, 80 - y]])
            sc.set_offsets(adjusted_positions)
            sc.set_color("red")
        elif row["team"] == away_team:
            adjusted_positions = np.array([[120 - x, 80 - y]]) if row["period"] == 1 else np.array([[x, y]])
            sc.set_offsets(adjusted_positions)
            sc.set_color("blue")

    ax.set_title(f"Periodo: {row['period']} | Tiempo: {row['timestamp']}s")
    plt.draw()
    plt.pause(0.1)  # pausa breve para ver el cambio

# Iteramos sobre las filas y actualizamos el gráfico
for _, row in data.iterrows():
    update(row)

plt.ioff()
plt.show()
