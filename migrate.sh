rm -rf ./src/store/actions
rm -rf ./src/store/factory
rm -rf ./src/store/migrations
rm ./src/store/getters.*
rm ./src/store/mutations.*
rm ./src/build.config.*
rm -rf ./src/swaps
rm -rf ./src/utils

cp -r ../wallet/src/store/actions ./src/store/
cp -r ../wallet/src/store/factory ./src/store/
cp -r ../wallet/src/store/migrations ./src/store/
cp ../wallet/src/store/getters.js ./src/store/
cp ../wallet/src/store/mutations.js ./src/store/
cp ../wallet/src/build.config.js ./src/store/
cp -r ../wallet/src/swaps ./src/
cp -r ../wallet/src/utils ./src/

npx ts-migrate renamne src/