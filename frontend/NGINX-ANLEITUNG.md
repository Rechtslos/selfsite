# Nginx Hosting Anleitung - Urheberrechtslos

## Schnell-Anleitung

### 1. Build-Ordner hochladen
Lade den kompletten `build/` Ordner auf deinen Server hoch nach:
```
/var/www/urheberrechtslos/
```

### 2. Nginx Config kopieren
Kopiere `nginx.conf` nach:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/urheberrechtslos
```

### 3. Symlink erstellen
```bash
sudo ln -s /etc/nginx/sites-available/urheberrechtslos /etc/nginx/sites-enabled/
```

### 4. Domain anpassen
Bearbeite `/etc/nginx/sites-available/urheberrechtslos` und ersetze:
```
server_name localhost;
```
mit deiner Domain:
```
server_name deine-domain.de www.deine-domain.de;
```

### 5. Nginx testen & neustarten
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Mit SSL (HTTPS) - Empfohlen!

### Certbot installieren
```bash
sudo apt install certbot python3-certbot-nginx
```

### SSL Zertifikat holen
```bash
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

Certbot passt die nginx config automatisch an.

---

## Ordnerstruktur auf dem Server

```
/var/www/urheberrechtslos/
├── index.html
├── static/
│   ├── css/
│   │   └── main.xxxxx.css
│   └── js/
│       └── main.xxxxx.js
├── favicon.ico
└── manifest.json
```

---

## Troubleshooting

**403 Forbidden?**
```bash
sudo chown -R www-data:www-data /var/www/urheberrechtslos
sudo chmod -R 755 /var/www/urheberrechtslos
```

**Seite nicht gefunden bei Refresh?**
Stelle sicher, dass `try_files $uri $uri/ /index.html;` in der nginx config ist.

---

Made with ♡ by Urheberrechtslos
