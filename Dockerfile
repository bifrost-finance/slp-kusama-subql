FROM onfinality/subql-node:latest as builder

COPY . /app
RUN cd /app && yarn
RUN cd /app && yarn build

FROM onfinality/subql-node:latest

COPY --from=builder /app/dist /app/dist
