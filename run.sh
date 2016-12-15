#!/bin/bash
echo -e '\033[0;32m'
echo '
 _  _             _  _  
| |// _  _  _    | |/ \ 
|  ( /o\/o\/_|   | ( o )
|_|\\\_/\_/L| () |_|\_/ 
                        
'
echo -e '\033[0;37m'
                        
_interupt() { 
    docker stop koor_elasticsearch koor_neo4j koor_vernemq
    echo "Shutdown $child_proc"
    kill -TERM "$child_proc" 2>/dev/null
    exit
}

trap _interupt INT TERM

workdir=${PWD} 

if !(docker run -d -p 9200:9200 -p 9300:9300 --name koor_elasticsearch elasticsearch:2.4 > /dev/null 2>&1)
then
    docker start koor_elasticsearch
fi
if !(docker run -d -p 7474:7474 -p 7687:7687 --env=NEO4J_AUTH="neo4j/koor.10" --name koor_neo4j neo4j > /dev/null 2>&1)
then
    docker start koor_neo4j
fi
HOST_IP=`ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if !(docker run --name koor_vernemq -d -p 1883:1883 -p 8080:8080 -e ENDPOINT_URL=http://"${HOST_IP}":3001/api/v1/mqtt registry.gitlab.com/thanhson1085/koor:broker > /dev/null 2>&1)
then
    docker start koor_vernemq
fi

cd $workdir/websocket && nodemon index.js &
child_proc=$! 
cd $workdir/users && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/socials && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/chats && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/swagger && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/apps && CLOUDFLARE_ENABLE=false nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/site && npm start &
child_proc="$child_proc $!"
cd $workdir/land && gulp dev &
child_proc="$child_proc $!"
cd $workdir/docs && PATH=./env/bin/ && mkdocs serve --dev-addr=0.0.0.0:8000 &
child_proc="$child_proc $!"
tail -f docker-compose.yml
