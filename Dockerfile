# Imagen base oficial de Node.js
FROM node:20

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto configurado en .env
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "index.js"]
