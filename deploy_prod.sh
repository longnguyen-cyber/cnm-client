sudo docker stop cnm-client
sudo docker rm cnm-client
sudo docker rmi client_workchat
sudo docker build -t client_workchat .
sudo docker run -d --restart=always -p 80:80 --name cnm-client client_workchat