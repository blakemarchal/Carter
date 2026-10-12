# Same as deploy.sh, for PowerShell:  .\deploy\deploy.ps1          (dev: spiritflow.church)
#                                     .\deploy\deploy.ps1 -Site prod (production: arkpals.world)
param([ValidateSet('dev', 'prod')][string]$Site = 'dev')
$ErrorActionPreference = 'Stop'
$HostName = if ($env:CARTER_HOST) { $env:CARTER_HOST } else { 'root@68.183.130.3' }
# Each site is its own folder, service and port on the same droplet, with its own .env and data.
$Dir, $Service, $Port = if ($Site -eq 'prod') { '/opt/ArkPals', 'arkpals-web', 3005 } else { '/opt/Carter', 'carter-web', 3004 }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'build failed' }
tar czf carter-deploy.tgz dist server package.json package-lock.json deploy
scp carter-deploy.tgz "${HostName}:/tmp/carter-deploy.tgz"
Remove-Item carter-deploy.tgz
# Strip CRs: with git's autocrlf this file is checked out with CRLF, and bash on the server chokes on them.
$Remote = @'
set -e
DIR=__DIR__ SERVICE=__SERVICE__ PORT=__PORT__
mkdir -p $DIR && cd $DIR
rm -rf dist && tar xzf /tmp/carter-deploy.tgz --exclude=.env && rm /tmp/carter-deploy.tgz
# The server's own packages (stripe), exactly as locked; the game itself is all in dist/.
npm ci --omit=dev --ignore-scripts --no-audit --no-fund --loglevel=error
chown -R root:root $DIR && chmod -R u=rwX,go=rX dist server deploy package.json package-lock.json node_modules
if systemctl is-enabled --quiet $SERVICE 2>/dev/null; then
  systemctl restart $SERVICE && sleep 1
  curl -fsS -o /dev/null -w "health: HTTP %{http_code}\n" -H "Accept: text/html" http://127.0.0.1:$PORT/
else
  echo "Files are in $DIR. First deploy: follow deploy/DEPLOY.md."
fi
'@
$Remote = $Remote.Replace('__DIR__', $Dir).Replace('__SERVICE__', $Service).Replace('__PORT__', "$Port")
ssh $HostName ($Remote -replace "`r", '')
