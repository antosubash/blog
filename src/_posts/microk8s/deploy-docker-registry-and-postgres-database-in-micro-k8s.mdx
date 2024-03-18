---
title: "Deploy docker registry and postgres database in MicroK8s"
excerpt: "In this post we will see how to deploy and secure the registry along with deploying a postgres database in microk8s"
date: "2022-09-14T19:53:18.980Z"
videoId: pxPARH8bF2s
series: "MicroK8s - Getting Started"
part: 3
tags: [ postgres, registry, "microk8s" ]
---

## Table of contents

## Introduction

In this post we will see how to deploy and secure the registry along with deploying a postgres database in microk8s. We will also see how to connect to the created registry. We will also see how to create a secret in kubernetes and use it in the deployment. We will also see how to create a persistent volume and use it in the deployment.  

## Parts

[Part 1. Setup MicroK8s With Ubuntu](/posts/setup-micro-k8s-with-ubuntu)

[Part 2. Setup Nginx and cert-manager in MicroK8s](/posts/setup-nginx-and-cert-manager-in-micro-k8s)

Part 3. Deploy docker registry and postgres database in MicroK8s (this post)

[Part 4. Create and deploy .Net application in MicroK8s](/posts/create-and-deploy-dotnet-application-in-micro-k8s)

## Docker Registry

### Registry login info

first lets create a username and password and store it in `registry.password` file.

```bash
touch registry.password
```

lets create the username and password.

```bash
docker run --entrypoint htpasswd httpd:2 -Bbn youruser yourpassword
```

lets store the username and password in the `registry.password` file.

```bash
docker run --entrypoint htpasswd httpd:2 -Bbn youruser yourpassword
```

> make sure to replace `youruser` and `yourpassword` with your own username and password.

this will output the username and password. copy the output and paste it in the `registry.password` file.

### Deploy registry

lets create a namespace for the registry.

```bash
microk8s kubectl create namespace registry
```

lets create a secret for the registry.

```bash
microk8s create secret generic auth-secret --from-file=registry.password -n registry
```

Now we have the auth-secret created. lets create the secret for the docker registry.

```yml
kubectl create secret docker-registry regcred -n default --docker-server=registry.yourdomain.com --docker-username=youruser --docker-password=yourpassword --docker-email=myemail@something.com
````

> make sure to replace the `yourdomain.com` with your domain name. also replace the `youruser` and `yourpassword` with the username and password you created earlier. also replace the `registry.yourdomain.com` with your domain name.

lets create the folder for the registry.

```bash
mkdir /mnt/registry
```

lets create the registry deployment.

```yml
apiVersion: v1
kind: Namespace
metadata:
  name: registry
  labels:
    app: registry
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: registry
  labels:
    app: registry
spec:
  replicas: 1
  selector:
    matchLabels:
      app: registry
  template:
    metadata:
      labels:
        app: registry
    spec:
      containers:
      - name: registry
        resources:
          requests:
            memory: "100Mi"
            cpu: "250m"
          limits:
            memory: "200Mi"
            cpu: "500m"
        image: registry:2
        ports:
        - containerPort: 5000
        volumeMounts:
        - name: repo-vol
          mountPath: "/var/lib/registry"
        - name: certs-vol
          mountPath: "/certs"
          readOnly: true
        - name: auth-vol
          mountPath: "/auth"
          readOnly: true
        env:
        - name: REGISTRY_AUTH
          value: "htpasswd"
        - name: REGISTRY_AUTH_HTPASSWD_REALM
          value: "Registry Realm"
        - name: REGISTRY_AUTH_HTPASSWD_PATH
          value: "/auth/registry.password"
        - name: REGISTRY_HTTP_TLS_CERTIFICATE
          value: "/certs/tls.crt"
        - name: REGISTRY_HTTP_TLS_KEY
          value: "/certs/tls.key"
        - name: VIRTUAL_HOST
          value: "registry.kdev.antosubash.com"
     
      volumes:
      - name: repo-vol
        hostPath:
          # directory location on host
          path: /mnt/registry
          # this field is optional
          type: Directory
      - name: certs-vol
        secret:
          secretName: registry-tls-secret
      - name: auth-vol
        secret:
          secretName: auth-secret
---
apiVersion: v1
kind: Service
metadata:
  name: docker-registry
  namespace: registry
spec:
  selector:
    app: registry
  ports:
  - port: 5000
    targetPort: 5000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: registry
  namespace: registry
  labels:
    app: registry
  annotations:
    cert-manager.io/cluster-issuer: "lets-encrypt"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
    nginx.ingress.kubernetes.io/proxy-body-size: 1024m
spec:
  tls:
  - hosts:
    - registry.kdev.antosubash.com
    secretName: registry-tls-secret
  rules:
  - host: registry.kdev.antosubash.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: docker-registry
            port:
              number: 5000   
```

> make sure to replace the `registry.kdev.antosubash.com` with your domain name.

apply the deployment.

```bash
microk8s kubectl apply -f registry.yml
```

lets check the pods.

```bash
microk8s kubectl get pods -n registry
```

lets check the services.

```bash
microk8s kubectl get services -n registry
```

lets check the ingress.

```bash
microk8s kubectl get ingress -n registry
```

Now we have the registry deployed. lets test it.

```bash
docker login registry.kdev.antosubash.com
```

> make sure to replace the `registry.kdev.antosubash.com` with your domain name.

if you managed to login to the registry, then you have successfully deployed the registry.

## Postgres Database

For this post, I am using the postgres database. you can use any database you want. I will be using the postgres database because it is the database I am most familiar with.

we will use the `PersistentVolume` to store the database data. so lets make we have the storage addon enabled.

```bash
microk8s status
```

if the storage addon is not enabled, then enable it.

```bash
microk8s enable hostpath-storage
```

Now we have the storage addon enabled. lets deploy the postgres database.

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes: [ReadWriteOnce]
  resources: { requests: { storage: 5Gi } }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
    name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
      task: postgres
  template:
    metadata:
      labels:
        app: postgres
        task: postgres
    spec:
      containers:
        - name: postgres
          image: kartoza/postgis:12.0
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: "test"
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASS
              value: "my_postgres_password"
            - name: --auth
              value: "md5"
            - name: POSTGRES_MULTIPLE_EXTENSIONS
              value: "postgis,hstore,postgis_topology"
          resources:
            requests:
              memory: "100Mi"
              cpu: "250m"
            limits:
              memory: "200Mi"
              cpu: "500m"
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  ports:
    - port: 5432
      targetPort: 5432
  selector:
    app: postgres
    task: postgres
---
```

apply the deployment.

```bash
microk8s kubectl apply -f postgres.yml
```

lets check the pods.

```bash
microk8s kubectl get pods
```

lets check the services.

```bash
microk8s kubectl get services
```

lets check the persistent volume claim.

```bash
microk8s kubectl get pvc
```

Now we have the postgres database deployed. lets test it.

To test the database, we will use the `adminer` tool. you can use any tool you want.

we will deploy the `adminer` tool.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pgweb
spec:
  selector:
    matchLabels:
      app: pgweb
  template:
    metadata:
      labels:
        app: pgweb
    spec:
      containers:
      - name: pgweb
        image: adminer
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: pgweb-service
spec:
  selector:
    app: pgweb
  ports:
  - port: 8080
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pgweb-ingress
  labels:
    name: pgweb-ingress
  annotations:
    kubernetes.io/ingress.class: "public"
    cert-manager.io/cluster-issuer: "lets-encrypt"
spec:
  tls:
    - hosts:
      - pgweb.kdev.antosubash.com
      secretName: pgweb-tls
  rules:
  - host: pgweb.kdev.antosubash.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: pgweb-service
            port: 
              number: 8080
```

apply the deployment.

```bash
microk8s kubectl apply -f pgweb.yml
```

lets check the pods.

```bash
microk8s kubectl get pods
```

lets check the services.

```bash
microk8s kubectl get services
```

lets check the ingress.

```bash
microk8s kubectl get ingress
```

Now we have the `adminer` tool deployed. lets test it.

> make sure to replace the `pgweb.kdev.antosubash.com` with your domain name.

Lets visit the `adminer` tool. [https://pgweb.kdev.antosubash.com](https://pgweb.kdev.antosubash.com) and login with the following credentials.

```bash
System: PostgreSQL
Server: postgres.default.svc.cluster.local
Username: postgres
Password: my_postgres_password
Database: test
```

## Conclusion

In this post, we have deployed the docker registry and postgres database to the microk8s cluster. we have also deployed the `adminer` tool to test the database. In the next post, we will deploy a simple dotnet core application to the microk8s cluster.

[Part 4. Create and deploy .Net application in MicroK8s](/posts/create-and-deploy-dotnet-application-in-micro-k8s)

## Credits

Docker registry is secured based on this post https://timvw.be/2021/11/08/hosting-a-secure-registry-on-microk8s/
