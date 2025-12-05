# ---------- Base stage: общая база ----------
	FROM node:18-alpine AS base
	WORKDIR /app
	
	# Копируем package.json для кэширования слоёв
	COPY package*.json ./
	
	# Устанавливаем зависимости
	RUN npm install
	
	# Копируем исходники
	COPY . .
	
	# ---------- Dev stage ----------
	FROM base AS dev
	ENV NODE_ENV=development
	# Проброс порта для локальной разработки
	EXPOSE 3000
	# Используем nodemon для автоперезагрузки
	CMD ["npx", "nodemon", "index.js"]
	
	# ---------- Prod stage ----------
	FROM node:18-alpine AS prod
	WORKDIR /app
	# Копируем prod-зависимости (чисто)
	COPY package*.json ./
	RUN npm ci --production
	
	# Копируем исходники
	COPY . .
	
	# Проброс порта для продакшена
	EXPOSE 3000
	# CMD ["node", "index.js"]
	CMD ["npm", "start"]
	