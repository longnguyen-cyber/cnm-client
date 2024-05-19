docker stop cnm-client
docker rm cnm-client
docker rmi cnm-client
docker build -t client_workchat .
docker run -d --restart=always -p 80:80 --name cnm-client client_workchat