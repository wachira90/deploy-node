# test-node
test deploy node

## install

````
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source .bashrc
nvm ls-remote
nvm install v16.13.2
npm i -g yarn@1.22.18 && npm i -g pm2@5.2.0 && npm i -g nodemon@2.0.16
````


## result

````
ubuntu@test-imac:~/test-node$ node -v && yarn -v && pm2 -v
v16.13.2
1.22.19
5.2.0
````
