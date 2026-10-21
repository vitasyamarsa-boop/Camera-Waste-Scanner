# --- TAHAP 1: Build React App ---
FROM node:18-alpine AS builder

# Tentukan working directory
WORKDIR /app

# Salin package.json dan package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh sisa source code project
COPY . .

# Jalankan perintah build (biasanya "npm run build")
RUN npm run build


# --- TAHAP 2: Serve dengan Nginx ---
FROM nginx:alpine

# Salin hasil build dari tahap builder ke folder public Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Catatan penting untuk Vite/CRA):
# Jika project Anda menggunakan Create React App standar (bukan Vite), 
# biasanya folder hasil build bernama "build" (bukan "dist"). 
# Jika demikian, ubah baris di atas menjadi:
# COPY --from=builder /app/build /usr/share/nginx/html

# Salin custom Nginx config (opsional, jika diperlukan untuk Single Page Application routing)
# Jika belum punya config Nginx, baris di bawah ini bisa di-skip dulu
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Buka port 80 untuk akses web
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]