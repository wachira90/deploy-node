# test-node
test deploy node

## install

````
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source .bashrc
nvm ls-remote
nvm install v16.13.2
npm i -g yarn@1.22.18 && npm i -g pm2@5.2.0 && npm i -g nodemon@2.0.16

sudo yum install rsync
sudo apt install rsync
````


## result

````
ubuntu@test-imac:~/test-node$ node -v && yarn -v && pm2 -v
v16.13.2
1.22.19
5.2.0
````


## run on local (172.16.1.5 remote)
````
ssh-keygen -t rsa -b 4096 -N "" -f "$HOME"/.ssh/id_rsa

ssh ubuntu@172.16.1.5 -p 22 "mkdir -p .ssh"

cat .ssh/id_rsa.pub | ssh ubuntu@172.16.1.5 -p 22 'cat >> .ssh/authorized_keys'

ssh ubuntu@172.16.1.5  -p 22 "chmod 700 .ssh; chmod 640 .ssh/authorized_keys"
````

## deploy command

````
npx shipit production deploy
````
