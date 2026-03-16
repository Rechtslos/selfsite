# Nginx Hosting Anleitung - Urheberrechtslos

## Super-Schnell-Anleitung (3 Schritte)

### 1. ZIP entpacken nach /var/www/urheberrechtslos/
```bash
sudo mkdir -p /var/www/urheberrechtslos
sudo unzip urheberrechtslos-nginx-ready.zip -d /var/www/urheberrechtslos/
```

### 2. Nginx Config aktivieren
```bash
sudo cp /var/www/urheberrechtslos/nginx.conf /etc/nginx/sites-available/urheberrechtslos
sudo ln -s /etc/nginx/sites-available/urheberrechtslos /etc/nginx/sites-enabled/
```

### 3. Nginx neustarten
```bash
sudo nginx -t && sudo systemctl reload nginx
```

**Fertig!** Deine Website läuft jetzt unter http://localhost (oder deine Server-IP)

---

## Domain einrichten

Bearbeite die nginx config:
```bash
sudo nano /etc/nginx/sites-available/urheberrechtslos
```

Ändere `server_name localhost;` zu:
```
server_name deine-domain.de www.deine-domain.de;
```

Dann:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## SSL (HTTPS) aktivieren - Empfohlen!

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

---

## Ordnerstruktur nach dem Entpacken

```
/var/www/urheberrechtslos/
├── index.html          ← Hauptseite
├── static/
│   ├── css/main.xxx.css
│   └── js/main.xxx.js
├── nginx.conf          ← Nginx Konfiguration
└── NGINX-ANLEITUNG.md  ← Diese Datei
```

---

## Troubleshooting

**403 Forbidden?**
```bash
sudo chown -R www-data:www-data /var/www/urheberrechtslos
sudo chmod -R 755 /var/www/urheberrechtslos
```

**Nginx startet nicht?**
```bash
sudo nginx -t   # Zeigt Fehler an
```

---
Made with ♡
