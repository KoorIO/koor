#!/bin/bash

echo -e '\033[0;32m'
echo '
 _  _             _  _  
| |// _  _  _    | |/ \ 
|  ( /o\/o\/_|   | ( o )
|_|\\\_/\_/L| () |_|\_/ 
                        
'
echo -e '\033[0;37m'

workdir=${PWD} 

cd $workdir/site && grunt build
cd $workdir/docs && PATH=$PATH:./env/bin/ && mkdocs build
wait
cd $workdir && sudo docker-compose build
