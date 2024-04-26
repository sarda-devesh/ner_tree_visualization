FROM ubuntu:22.04

ENV TZ=Asia/Dubai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && \
    apt-get install -y \
        g++ \
        make \
        wget \
        unzip \
        vim \
        git \
        dstat \
        curl \
        sudo \
        python3-pip

SHELL ["/bin/bash", "-c"]

# Install nvm and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    source ~/.nvm/nvm.sh && \
    nvm install 22

# Set up working directory
RUN mkdir /working_dir
WORKDIR /working_dir
