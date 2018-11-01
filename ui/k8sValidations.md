**k8s validations by canvas object**

## No Object Selected

### info
  - Name = required / string / letters upper and lowercase allowed, numbers, underscores, and dashes allowed
  - Description = string
  - ID = displayed value, non editable (no validations required)

### Secrets
  - Secret Name = required / string / letters upper and lowercase allowed, numbers, underscores, dashes, and periods allowed, double dash, double period, and double underscore not allowed, starts and ends with dash or underscore not allowed
  - Mode = required / string / numbers only allowed / length of 3 numbers allowed

### Config Maps
  - Name = required / string / letters upper and lowercase allowed, numbers, underscores, dashes, and periods allowed, double dash, double period, and double underscore not allowed, starts and ends with dash or underscore not allowed
  - Map Name = string
  - Default Mode = required / string / numbers only allowed / length of 3 numbers allowed

## End No Object Selected

## Start Container

### Info
  - Name = required / string / unique / letters upper and lowercase allowed, numbers, underscores, and dashes allowed
  - Description = string
  - Image = string

### Environment Variables  
  - name = required / string / upper and lowercase letters allowed, numbers and underscores allowed
  - value = not required / string?? (can it be a boolean or number) / all characters allowed  

### Secrets
  - Name = dropdown with available secrets (no validations required)
  - Target = required / string / upper and lowercase letters allowed, numbers, underscores, dashes, forward slashes, and periods allowed, double dash and double underscore not allowed, starts and ends with dash or underscore not allowed

### Config Maps
  - Name = dropdown with list of config maps (no validations required)
  - Path = required / string / upper and lowercase letters allowed, numbers, underscores, dashes, forward slashes, and periods allowed, double dash and double underscore not allowed, starts and ends with dash or underscore not allowed

### Ports  
  - internal = required / integer / no less than 1 and no greater than 65535  
  - Name = not required / string / length 63 or less / upper, lower case letters, and numbers allowed
  - Protocol = dropdown with TCP or UDP (no validations required)

### Volumes
  - Name = prepopulated by connected Volumes
  - Path = string
  - Access Mode = dropdown with Read Only Many, Read Write Once, and Read Write Many (no validations required)

### Liveness Probe
  - Interval = integer
  - Timeout = integer
  - Retries = integer
  - Liveness Probe Command = required / string  

### Readiness Probe
  - Interval = integer
  - Timeout = integer
  - Retries = integer
  - Readiness Probe Command = required / string  

### Advanced
  - Command = string
  - Entrypoint = string
  - Image Pull Policy = dropdown with Always and If Not Present (no validations required)

## End Container

## Start Service

### Info
  - Name = required / string / unique / letters upper and lowercase allowed, numbers, underscores, and dashes allowed
  - Type = dropdown with ClusterIP, NodePort, LoadBalancer, and ExternalName (no validations required)
  - Cluster IP = not required / string / valid ip address (number.number.number.number / number = 0 to 255)
  - Node Port = not required / integer / no less than 1 and no greater than 65535

### Selectors
  - Name = required / string / letters lowercase allowed, periods and dashes allowed
  - Value = required / string

### Ports
  - External = not required / integer / no less than 0 and no greater than 65535
  - Internal/Name = prepopulated uneditable (no validations required)
  - Protocol = prepopulated uneditable (no validations required)
  - Container = perpopulated uneditable (no validations required)

## End Service

## Start Volume

### Info
  - Name = required / string / unique / letters upper and lowercase allowed, numbers, underscores, and dashes allowed
  - Description = string
  - Access Modes = checkboxes with Read Only Many, Read Write Once, and Read Write Many (no validations required)
  - Volume Mode = dropdown with Filesystem and Block Device (no validations required)  
  - Storage Class = string
  - Storage = integer

## End Volume

## Start Stateful Set

### Info
  - Name = required / string / unique / letters upper and lowercase allowed, numbers, underscores, and dashes allowed
  - Description = string
  - Replicas = integer
  - Service Name = not required / string / letters upper and lowercase allowed, numbers, underscores, dashes, and periods allowed  
  - Grace Period = integer
  - Update Strategy = dropdown with Rolling Update, On Delete, and Partitions (no validations required)  
  - Pod Management = dropdown with Ordered Ready, and Parallel (no validations required)  
  - Restart = dropdown with Always, On Failure, and Never (no validations required)  
  - Mode = dropdown with Replicated, and All Nodes (no validations required)  

### Labels
  - Name = required / string / letters lowercase allowed, numbers, dashes, and periods allowed
  - Value = required / string

### Controller Labels
  - Name = required / string / letters lowercase allowed, numbers, dashes, and periods allowed
  - Value = required / string

### Host Aliases
  - Host = required / string  

## End Stateful Set

## Deployment

### Info
  - Name = required / string / letters upper and lowercase allowed, underscores and dashes allowed
  - Description = string
  - Replicas = integer

### Labels
  - Name = required / string / letters lowercase allowed, numbers, dashes, and periods allowed
  - Value = required / string

### Controller Labels
  - Name = required / string / letters lowercase allowed, numbers, dashes, and periods allowed
  - Value = required / string

### Host Aliases
  - Host = required / string

### Cron Job
  - activeDeadlineSeconds = requried / positive integer
  - startingDeadlineSeconds = optional / integer
  - backoffLimit = required / integer / default is 6
  - completions = required / positive integer or 0
  - parallelism = required / positive integer
  - schedule = requried / string / CRON pattern
  - concurrency policy = required / either Allow, Forbid, Replace

## End Deployment
