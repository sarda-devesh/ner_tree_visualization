# ner_tree_visualization

In order to setup the environment run the commands:
```
$ docker build -t ner_visualization .
$ docker kill ner_visualization
$ docker rm ner_visualization
$ CURRENT_DIR=`pwd` && docker run --gpus all -d -v $CURRENT_DIR:/working_dir/ -p 3000:3000 --name=ner_visualization ner_visualization:latest sleep infinity
$ docker exec -it ner_visualization bash
$ cd tree_visualization
$ npm install
```

You can start the server using:
```
$ npm start
```