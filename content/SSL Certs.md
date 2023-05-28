---
title: SSL Certs
lastmod: 2023-05-27T21:55:23-05:00
---
# SSL Certs
Old script to generate certificate
```powershell
#create ca key
openssl genrsa -out ca.key 4096
#create ca
openssl req -new -x509 -days 365 -key ca.key -out ca.cert.pem -config .\openssl-custom.cnf
#create server key (private key)
openssl genrsa -out server.key 4096
#create server certificate signing request (csr)
openssl req -new -key server.key -out server.csr -config .\openssl-custom.cnf
#create certificate (public key)
openssl x509 -req -days 365 -in server.csr -CA ca.cert.pem -CAkey ca.key -CAcreateserial -out server.crt

rm ca.cert.pem
rm ca.cert.srl
rm ca.key
rm server.csr

Write-Host ">>>Import server.crt into your browser under the certificate authorities category."
Write-Host ">>>In Firefox, you will need to go to about:config and set security.enterprise_roots.enabled to true"
```