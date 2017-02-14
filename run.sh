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
    docker stop koor_elasticsearch koor_neo4j koor_vernemq koor_redis koor_mongo
    echo "Shutdown $child_proc"
    kill -TERM "$child_proc" 2>/dev/null
    exit
}

trap _interupt INT TERM

workdir=${PWD} 

if !(docker run -d -p 9200:9200 -p 9300:9300 --name koor_elasticsearch elasticsearch > /dev/null 2>&1)
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
if !(docker run -d -p 27017:27017 --name koor_mongo mongo > /dev/null 2>&1)
then
    docker start koor_mongo
fi
if !(docker run --name koor_redis -p 6379:6379 -d redis > /dev/null 2>&1)
then
    docker start koor_redis
fi

cd $workdir/websocket && nodemon index.js &
child_proc=$! 
cd $workdir/users && npm start &
child_proc="$child_proc $!"
cd $workdir/socials && npm start &
child_proc="$child_proc $!"
cd $workdir/chats && npm start &
child_proc="$child_proc $!"
cd $workdir/swagger && npm start &
child_proc="$child_proc $!"
cd $workdir/apps && CLOUDFLARE_ENABLE=false npm start &
child_proc="$child_proc $!"
cd $workdir/site && npm start &
child_proc="$child_proc $!"
cd $workdir/land && gulp dev &
child_proc="$child_proc $!"
cd $workdir/cms && rails s -b 0.0.0.0 -p 3007 &
child_proc="$child_proc $!"
cd $workdir/docs && PATH=./env/bin/ && mkdocs serve --dev-addr=0.0.0.0:8000 &
child_proc="$child_proc $!"
tail -f docker-compose.yml
