RED='\033[0;31m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color
while true; do 
  TIME=`date "+[%H:%M:%S]"`
  echo -n "$TIME Compilation ..."; 
  ./node_modules/babel-cli/bin/babel.js --presets react-native index.ios.js > /dev/null ;
  if [ $? -eq 0 ]
  then
    printf " ${ORANGE}success!${NC}\n"
  else
    printf " ${RED}failure!${NC}\n"
  fi
  sleep 5; 
done
