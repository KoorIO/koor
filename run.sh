#!/bin/bash
_interupt() { 
    echo "Shutdown $child_proc"
    kill -TERM "$child_proc" 2>/dev/null
    exit
}

trap _interupt INT TERM

workdir=${PWD} 

docker run -p 9200:9200 -p 9300:9300 elasticsearch:2.4 &
child_proc=$! 
docker run -p 7474:7474 neo4j &
child_proc="$child_proc $!"

cd $workdir/websocket && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/users && nodemon index.js &
child_proc="$child_proc $!"
cd $workdir/socials && nodemon index.js &
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
