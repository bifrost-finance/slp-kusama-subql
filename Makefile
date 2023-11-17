IMAGE=harbor.liebi.com/slp/kusama-subql:v1.8

deploy:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}
	kubectl set image deploy -n slp slp-vksm-kusama slp-vksm-kusama=${IMAGE}
	kubectl rollout restart deploy  -n slp slp-vksm-kusama