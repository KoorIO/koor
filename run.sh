#!/bin/bash
_interupt() { 
    docker stop koor_elasticsearch koor_neo4j
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
