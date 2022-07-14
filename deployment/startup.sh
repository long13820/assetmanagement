php artisan optimize:clear
php artisan migrate --force
cp /home/site/default /etc/nginx/sites-available/default
service nginx reload
