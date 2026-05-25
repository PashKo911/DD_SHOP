	FROM node:18-alpine AS base
	WORKDIR /app
	
	COPY package*.json ./
	
	RUN npm install
	
	COPY . .
	
	FROM base AS dev
	ENV NODE_ENV=development
	EXPOSE 3001
	CMD ["npx", "nodemon", "index.js"]
	
	FROM node:18-alpine AS prod
	WORKDIR /app
	COPY package*.json ./
	RUN npm ci --production
	
	COPY . .
	
	EXPOSE 3001
	# CMD ["node", "index.js"]
	CMD ["npm", "start"]
	