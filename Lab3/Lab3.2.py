import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Параметри
a = 0.082e-6
L = 0.5
N = 100
T = 360000
h = 150
alpha = 11
beta = 30

delta = L / N
mu = a / (delta ** 2)
M = int(T / h)

# Чисельний розв’язок (той самий код, що раніше)
u = np.zeros((M+1, N+1))
u[:, 0] = alpha
u[:, N] = beta
u[0, 1:N] = 0

def derivatives(u_t):
    du_dt = np.zeros(N+1)
    for i in range(1, N):
        du_dt[i] = mu * (u_t[i+1] - 2 * u_t[i] + u_t[i-1])
    return du_dt

for t in range(M):
    u_t = u[t, :]
    k1 = derivatives(u_t)
    k2 = derivatives(u_t + 0.5 * h * k1)
    k3 = derivatives(u_t + 0.5 * h * k2)
    k4 = derivatives(u_t + h * k3)
    u[t+1, :] = u_t + (h / 6) * (k1 + 2*k2 + 2*k3 + k4)
    u[t+1, 0] = alpha
    u[t+1, N] = beta

# Аналітичний розв’язок
def analytical_solution(t, y, n_terms=100):
    u = (beta - alpha) / L * y + alpha
    for n in range(1, n_terms + 1):
        coeff = (beta * (-1)**n - alpha) / n
        exponent = -a * t * (np.pi * n / L)**2
        sine = np.sin(np.pi * n * y / L)
        u += (2 / np.pi) * coeff * np.exp(exponent) * sine
    return u

# Обчислення аналітичного розв’язку для всіх точок
y = np.linspace(0, L, N+1)
t = np.linspace(0, T, M+1)
u_analytical = np.zeros((M+1, N+1))
for i in range(M+1):
    for j in range(N+1):
        u_analytical[i, j] = analytical_solution(t[i], y[j])

# Візуалізація 3D графіка
T_grid, Y_grid = np.meshgrid(t, y)
fig = plt.figure(figsize=(12, 6))

# Чисельний розв’язок
ax1 = fig.add_subplot(121, projection='3d')
ax1.plot_surface(T_grid, Y_grid, u.T, cmap='viridis')
ax1.set_xlabel('Час (с)')
ax1.set_ylabel('y (м)')
ax1.set_zlabel('Температура (°C)')
ax1.set_title('Чисельний розв’язок')

# Аналітичний розв’язок
ax2 = fig.add_subplot(122, projection='3d')
ax2.plot_surface(T_grid, Y_grid, u_analytical.T, cmap='viridis')
ax2.set_xlabel('Час (с)')
ax2.set_ylabel('y (м)')
ax2.set_zlabel('Температура (°C)')
ax2.set_title('Аналітичний розв’язок')

plt.show()

# Обчислення помилок MAE і MSE
MAE = np.max(np.abs(u - u_analytical))
MSE = np.mean((u - u_analytical)**2)
print(f"MAE: {MAE}")
print(f"MSE: {MSE}")