# {{ ansible_managed }}

upstream jenkins {
    server 127.0.0.1:8080 fail_timeout=0;
}

server {
    listen 80;
    server_name {{ jenkins.url }};

    location ~* {
        rewrite ^ https://{{ jenkins.url }}$request_uri? permanent;
    }
}

server {
    listen 443 ssl spdy;
    server_name {{ jenkins.url }};

    ssl on;
    ssl_certificate /etc/ssl/{{ jenkins.ssl.certificate }};
    ssl_certificate_key /etc/ssl/{{ jenkins.ssl.key }};
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DES-CBC3-SHA:!ADH:!AECDH:!MD5;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    add_header Strict-Transport-Security "max-age=63072000";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;

        if (!-f $request_filename) {
            proxy_pass http://jenkins;
            break;
        }
    }
}
