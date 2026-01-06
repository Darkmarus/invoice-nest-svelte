FROM invoice-svelte-deps AS builder

WORKDIR /app

COPY . .

RUN node --run build


FROM nginx:1.29.4-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]