# From base image node
FROM node:16
 
# Create app directory
RUN mkdir -p /usr/src/app
 
# Set the /usr/src/app directory to WORKDIR
WORKDIR /usr/src/app
 
# Copying all the files from your file system to container file system
COPY package.json .
 
# Install all dependencies
RUN npm install
 
# Copy other files too
COPY ./ .

# 7. 포트 노출
EXPOSE 8001 8002

# Command to run app when intantiate an image
CMD ["npm","start"]