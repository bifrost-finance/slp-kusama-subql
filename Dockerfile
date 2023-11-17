FROM onfinality/subql-node:latest 

COPY . /app
# RUN cd /app && yarn
# RUN cd /app && yarn build

# FROM onfinality/subql-node:latest
# COPY project.yaml /app/project.yaml
# COPY project.yaml /project.yaml
# COPY --from=builder /app/dist /app/dist
