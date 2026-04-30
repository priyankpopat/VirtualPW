# Stage 1: Serve static files with Nginx
FROM nginx:alpine

# Copy frontend files to nginx
COPY index.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY api-client.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Create custom nginx config for SPA
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
