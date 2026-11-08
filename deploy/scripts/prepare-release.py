"""Pin the tested source revision and matching internal-registry image in Git."""
import argparse
import json
from pathlib import Path
import re

import yaml

ROOT = Path(__file__).resolve().parents[2]


def commit_sha(value):
    if not re.fullmatch(r"[0-9a-f]{40}", value):
        raise ValueError("Release inputs must use full Git commit SHAs")
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--revision")
    parser.add_argument("--common-revision", action="store_true")
    args = parser.parse_args()
    common = commit_sha(json.loads((ROOT / "deploy/build-inputs.json").read_text())["alisaCloudRevision"])
    if args.common_revision:
        print(common)
        return
    if not args.revision:
        parser.error("--revision is required when preparing a release")
    revision = commit_sha(args.revision)
    image = f"registry.kind.internal:5000/smallokr:git-{revision}-common{common[:12]}"
    build_file = ROOT / "deploy/kubernetes/smallokr-build.yaml"
    build = list(yaml.safe_load_all(build_file.read_text()))
    pod = next(item for item in build if item["kind"] == "Job")["spec"]["template"]["spec"]
    source = next(container for container in pod["initContainers"] if container["name"] == "source")
    source["env"] = [
        {"name": "SOURCE_REVISION", "value": revision},
        {"name": "CLOUD_REVISION", "value": common},
    ]
    publisher = next(container for container in pod["containers"] if container["name"] == "publish-image")
    publisher["args"] = [
        f"--destination={image}" if arg.startswith("--destination=") else arg
        for arg in publisher["args"]
    ]
    services_file = ROOT / "deploy/kubernetes/smallokr.yaml"
    services = list(yaml.safe_load_all(services_file.read_text()))
    for resource in services:
        if resource["kind"] == "Deployment":
            for container in resource["spec"]["template"]["spec"]["containers"]:
                container["image"] = image
    build_file.write_text(yaml.safe_dump_all(build, sort_keys=False))
    services_file.write_text(yaml.safe_dump_all(services, sort_keys=False))
    print(f"Prepared {revision} as {image}")


if __name__ == "__main__":
    main()
