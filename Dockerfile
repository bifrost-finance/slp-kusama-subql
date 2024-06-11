FROM node:18 as builder

WORKDIR /app
COPY . ./

RUN yarn
RUN yarn codegen
RUN yarn build


FROM onfinality/subql-node:v2.12.6
COPY --from=builder /app/ /app/
