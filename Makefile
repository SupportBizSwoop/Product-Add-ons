init:
	npm run build

test:
	exit 0

compile:
	make init && \
	rm -rf ./zAddon || true && \
	mkdir zAddon && \
	cp -r assets ./zAddon && cp -r includes ./zAddon/includes && \
	cp LICENSE.txt ./zAddon && cp readme.txt ./zAddon && cp index.php ./zAddon

prepare-zip:
	rm zAddon.zip || true && zip -r zAddon.zip ./zAddon

build-zip:
	make compile && \
	prepare-zip && \
	rm -rf zAddon

test-deploy:
	make compile && \
	sh ./.scripts/test-deploy.sh && \
	rm -rf zAddon
