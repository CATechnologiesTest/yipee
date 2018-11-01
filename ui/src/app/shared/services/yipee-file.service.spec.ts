import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { YipeeFileService } from './yipee-file.service';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { YipeeFileRaw } from '../../models/YipeeFileRaw';

describe('YipeefileService', () => {

  const testServersideYipeeFile: YipeeFileRaw = {
    'appinfo': {
      'id': 'foo',
      'name': 'test',
      'description': 'long description'
    },
    'volumes': [
      {
        'id': '1111',
        'name': 'backend_apigateway_consul_data',
        'annotations': {
          'description': '[insert description of volume here]'
        },
        'driver_opts': []
      }
    ],
    'networks': [
      {
        'id': '2222',
        'driver': 'overlay',
        'name': 'backend-apigateway-net',
        'annotations': {
          'description': '[insert description of network here]'
        }
      },
      {
        'id': '3333',
        'driver': 'overlay',
        'name': 'backend-app-net',
        'annotations': {
          'description': '[insert description of network here]'
        }
      }
    ],
    'services': [
      {
        'id': '4444',
        'name': 'oscvt',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'restart': 'never',
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '5555',
        'name': 'uicvt',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'restart': 'always',
        'image': 'yipee-tools-spoke-cos.ca.com:5000/uicvt',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '6666',
        'name': 'secret_scanner',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'restart': 'always',
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '7777',
        'name': 'kubecvt',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'restart': 'always',
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '8888',
        'name': 'db',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'secrets': [
          {
            'uid': '0',
            'mode': '444',
            'source': 'mysecret',
            'gid': '0',
            'target': 'DbAccess'
          }
        ],
        'image': 'postgres:9.5.5-alpine',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '9999',
        'restart': 'always',
        'name': 'backend-orig',
        'depends_on': [
          'kubecvt',
          'yipee_validator',
          'db',
          'auth',
          'secret_scanner',
          'oscvt',
          'uicvt',
          'composecvt'
        ],
        'volumes': [],
        'networks': [
          {
            'aliases': [
              'backend'
            ],
            'name': 'backend-app-net'
          }
        ],
        'ports': [
          '5000:3000'
        ],
        'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:uifmt',
        'annotations': {
          'externalenv': [
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[11]',
              'varname': 'YIPEE_TEAM_OWNER'
            },
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[0]',
              'varname': 'CALLBACK_HOST'
            },
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[1]',
              'varname': 'CLIENT_ID'
            },
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[2]',
              'varname': 'CLIENT_SECRET'
            }
          ],
          'description': '[insert description of service here]'
        },
        'environment': [
          'CALLBACK_HOST=${CALLBACK_HOST}',
          'CLIENT_ID=${CLIENT_ID}',
          'CLIENT_SECRET=${CLIENT_SECRET}',
          'CONTAINER_URL=http://composecvt:9090',
          'DOKKEN_URL=http://backend:3000',
          'GITHUB_HOST=github.com',
          'KUBERNETES_URL=http://kubecvt:9090',
          'LOG_LEVEL=info',
          'OPENSHIFT_URL=http://oscvt:9090',
          'PG_HOST=db',
          'PG_PORT=5432',
          'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
          'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
        ]
      },
      {
        'id': '7878',
        'restart': 'always',
        'name': 'ui',
        'volumes': [],
        'networks': [
          {
            'name': 'default'
          }
        ],
        'ports': [
          '8443:443',
          '8080:80'
        ],
        'image': 'yipee-tools-spoke-cos.ca.com:5000/korn',
        'annotations': {
          'description': '[insert description of service here]'
        },
        'environment': [
          'API_HOST=backend:3000',
          'CORS_POLICY=app.yipee.io|github.com'
        ]
      },
      {
        'id': '7998',
        'name': 'composecvt',
        'networks': [
          {
            'name': 'default'
          }
        ],
        'restart': 'always',
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
        'volumes': [],
        'annotations': {
          'description': '[insert description of service here]'
        }
      },
      {
        'id': '3344',
        'name': 'backend-apigateway-consul',
        'command': [
          'agent',
          '-server',
          '-client=0.0.0.0',
          '-bind=0.0.0.0',
          '-bootstrap-expect 1',
          '-data-dir=/consul/data -ui'
        ],
        'volumes': [
          'backend_apigateway_consul_data:/consul/data'
        ],
        'networks': [
          {
            'aliases': [
              'consul'
            ],
            'name': 'backend-apigateway-net'
          }
        ],
        'image': 'consul',
        'annotations': {
          'description': '[insert description of service here]'
        },
        'deploy': {
          'mode': 'allnodes',
          'count': 1
        }
      },
      {
        'id': '1123',
        'name': 'auth',
        'depends_on': [
          'db'
        ],
        'volumes': [],
        'networks': [
          {
            'name': 'default'
          }
        ],
        'ports': [
          '8128:8128'
        ],
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-auth',
        'annotations': {
          'externalenv': [
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[4]',
              'varname': 'YIPEE_TEAM_OWNER'
            }
          ],
          'description': '[insert description of service here]'
        },
        'environment': [
          'POSTGRES_DB=postgres',
          'POSTGRES_HOST=db',
          'POSTGRES_SSL=disable',
          'POSTGRES_USER=postgres',
          'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
        ]
      },
      {
        'id': '22334',
        'name': 'backend',
        'volumes': [],
        'networks': [
          {
            'aliases': [
              'backend'
            ],
            'name': 'default'
          },
          {
            'aliases': [
              'backend-apigateway'
            ],
            'name': 'backend-app-net'
          },
          {
            'aliases': [
              'backend-apigateway'
            ],
            'name': 'backend-apigateway-net'
          }
        ],
        'ports': [
          '5000:8080'
        ],
        'image': 'caapim/microgateway:1.0.00',
        'annotations': {
          'externalenv': [
            {
              'description': '[insert description of environment variable here]',
              'reference': 'environment[7]',
              'varname': 'SSG_SSL_KEYPASS'
            }
          ],
          'description': '[insert description of service here]'
        },
        'environment': [
          'QUICKSTART_REPOSITORY_CONSUL_HOST=consul',
          'QUICKSTART_REPOSITORY_CONSUL_PORT=8500',
          'QUICKSTART_REPOSITORY_CONSUL_PROTOCOL=http',
          'QUICKSTART_REPOSITORY_TYPE=consul',
          'SSG_ADMIN_PASSWORD=${SSG_ADMIN_PASSWORD:-password}',
          'SSG_ADMIN_USERNAME=${SSG_ADMIN_USERNAME:-admin}',
          'SSG_INTERNAL_SERVICES=restman',
          'SSG_SSL_KEY=${SSG_SSL_KEY:-MIIJgQIBAzCCCUcGCSqGSIb3DQEHAaCCCTgEggk0MIIJMDCCA+cGCSqGSIb3DQEHBqCCA9gwggPUAgEAMIIDzQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQYwDgQISDjHYsOqteQCAggAgIIDoFbVJlvlDz8Fvx7UuUz9y4QuqWimKIcanYBJoDHEXKA+n8BzdIGrS/TFeRjo6PMEzOwZ+fYMBu9WnoLFidsBeLst4PZ1U1ZhY7qkbqhQ7EGNCIxQadfuhUKOYtNEowIS/KKsT4vX5Bu51OpB8aUA22/IOcQMuziccZxHnqhp7bRpQy2zqnbzLwo51kr+VmGIDwm2l+scR4sN+boNGd20hgt9IiFWAHckWIP4q+bvfgzkEGMZlgJqlsy47T2N6pzydPiSs64IQO5zCIA2bTjDmlt3ZesiZVn6+vuEQK/wOBr12duaCmSU/UieeMH3UQEc9C8RmmaPA0kSq1OAkUo/A2ieAaf93kKBswUUJluPDwVyK+hp6MRHKzYGav1BJdgufZhDcjcnXhDC+3xgagnF7z+Mnx+R9/MMBhdiqOKwVLC8BFmQNphlqWlGKESjuAa4A666bLduACtRHvkgX+iY52QjphVIDy1wtDY+5sCcqiGSViD7FajXb72duIUh1SXRS22aMYT7UeCusGFCyf/qU2c7EzKw+OJUy6qZ3ckO79Chqx8v2NWPBMDNfHplt/eVak0hazuZvBl0xC/69tCiuMlsuCh6Ryt4qQzBI+HpaXlGMohe5XMhr7ZRi2jEQip6c6LTJilmoZHcn3ooBPpMX840Xra/JW3ONqsCBHr1esnvh8XlYl8u3d0ckrczQ+GO8Vz7br3MM8zkdk0nFud3XLxIsozBBS4GAT+d7AMlF2rcToHob8xeMUnGH7kNSBffz53SXId7dkkpUkdG62rnTGf4KRY+Z/Gp4Guu4GvJ2Xaoeh99FDb5NFxX3HAxYsTuVBXXjRvF++O2BMf/roD/Q+knHNOGyzFBfbEx1xgy52fMGIfQc1ZI9qASGcmbOGyooasbFdxvcqeA3H702rNcgOOoxflBTTKxZhY3EljQnnnvdHfEKJM7+bSGIIGs4ev3bbT8kSnee3SMSVUBnTLahcQp0UO/uG8wQtNaiPvurmXg0+c0VVaVXmUI/VjqyW6sFlxgpbK1HMGE5f81M3+V7+lExiGnfurDyygxaHgn31zU65+MOtZsrCOqNlcmORm+3Q5HRf3pJ1a7FDMiF3MhTpNNugYA3FnTMTjMN/o5RgRE11BzpfTDf44/AJ36OJUOmqVXtvuv6vdLkLgZIgbS12OXLCsyf2oZI4Y7f0W3HutWABPki/EtaCMGkDIGd6WYmF8mOmzCNCiwIKxDvJrfmREwggVBBgkqhkiG9w0BBwGgggUyBIIFLjCCBSowggUmBgsqhkiG9w0BDAoBAqCCBO4wggTqMBwGCiqGSIb3DQEMAQMwDgQILbN/FZP39v8CAggABIIEyPCQMJbdxChXcHQZuhStgxXE3Nu1S7Foflmgt5zUqDNqKTzB6b+MwDSC9HU4nEC6bwsp0Q7dKULz8sHobgouxXa1PsFdVKImlIeroFwBXHA5iYiOb3cdSeZzN+yk7ezvaUxbAd5f4uHulS1QjEuteo5JPjK6Geoo1z8fTp1gCJwnON/6VVFk3ZbbNzvozVK95/kYuL/3EsSH7L5ZVBlwKrDCkvdOZUr+H+Eehu2WlmbyBLPcojuhwxzOQhPqnEzXpo1GmdSceUEbiABM058oSSy2+3PiHPaq3d3Uu7dLh8XKTB4tyhaQHsGb1ZKe7bp/Smk3EPjz5WKKLC/VY3inLSke4H8Tmwu5R0u53FjwULesNSCSoRSAmKN97INwiO5eAzLL4i0Js6GyFfNIRSGhIvIaqIl6WKlZxq8DTRQH0o7rEwcoYUdLzTty7FbtOJohDDTf7hkQIR3oyHWjQmVqAJsSOFpMRDD/EPtEJQUDXtPA8DrZimoijsVqBSnlf6RE5dhXROf1L2IxU6R/7Eyj+M0MGO1KIqVtgRdr6MjAWJRw5QaAF4/HFb7cM6VRLmXliekucPRkyNp95qUoERfwcoo348rgKjUpnQjUgLkyVb+ByGVtS8Jgf7xUO85wn561IjKPYKaddjMEVJaXmFnPvRbmovknUAnqiphi69/j8q01XWRq+nvsY8YawsHrCE3Wund4CYn406RdNDJDSE1hCvA1zoxqZZVDz/kwWnkWZ7IwXT4YREK/XobsKK9VP0M8En+zRdZoEQ75GQj7zcrlzZcpUFe0JoMODRWQtfdMQv47RdQPgHTUYPqHrFJN8H5tRA+VlSxWeG4eEzIKf0QOSXOkd05gm5RLT0IGCD4qF5XzfizGEgGtYBdJTGHOsLxV3x07zUs+tp5l7nSpZn7ooZbqlBcSqkDcm9WJS7rjXpFLNoNh8k6L/veMDDXHWfzNcGCOSx7xmKCRnSFKqKuhjz9J71pwtm2eUWuqMJwYu1y8zocjOCu8XnoQHyWaXfOSUZCCc/nCVHA6Z6SxxRyl3sR1U3egF69AzoaDEQb0PPWfn2SBgoCffiYUdpwrJVVWGlKBTp1dQOXrt9kBnyUrdVmguTZfR3cCeElePxqELe7GmYMJBHaPyi1PBCRCYHe6CaE/brPYCfKM01ukBy48GLZRfqdQRgUirYckYyeYaxNANRrxJoY0GxRWKD0LuCCfUcjJyYUiyyjwcnQxU0Ce6Pw6r4WQ9ubuyV3wuh4o8zyc7JtsT+02eTimZqSKafXm6vJqyJnJQo1D1nEWkv+5IGhEK0E1M6OKdqvyT4QNXJkoPIx+vmAUn8cz8Jg9dtxhxi4Qpmfov1DJmsiJ/DBi2bWQaRJB5fyvCj1TVt1LVXDgmF2nSpttCYenZkKopS/Q+C6aecB7wxNFmSkUkJ9OVYVkt/YCGrZ8GLpdJU6wwhfdb5bsuna5qohm9E3fXiEbG3IcN9DXJLWyRtWSxO/rj2VAu0z9EyAE8LEw50hhjkIj7a6D7RAm0PlvWQtZLuHSIJwbefpnZIeDwaXBDHW8mk96ffJxYeeY8QTv1IKcooHo2lOhpcjoGftmr7yZUiXI1K8znrlJGOpeacq3selNmvQ116g4RiNlHDElMCMGCSqGSIb3DQEJFTEWBBR1meeVXtD0TcFJXKHlO4QdOTfFsjAxMCEwCQYFKw4DAhoFAAQUL2GRjzKehD3+/Oo6wM/jIioHzEAECKrOA952vP07AgIIAA==}',
          'SSG_SSL_KEY_PASS=${SSG_SSL_KEYPASS}'
        ],
        'deploy': {
          'mode': 'allnodes',
          'count': 1
        }
      },
      {
        'id': '3488',
        'restart': 'always',
        'name': 'yipee_validator',
        'volumes': [],
        'networks': [
          {
            'name': 'default'
          }
        ],
        'ports': [
          '9099:9099'
        ],
        'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
        'annotations': {
          'description': '[insert description of service here]'
        }
      }
    ],
    'secrets': [
      {
        'id': 'xxxff',
        'name': 'mysecret',
        'external': true,
        'annotations': {
          'description': '[insert description of secret here]'
        }
      }
    ]
  };

  const mockUserInfo: any = {
    githubUsername: 'copan02',
    avatarURL: 'https://avatars.github-isl-01.ca.com/u/4187?',
    firstName: 'AJ',
    lastName: 'Copley',
    email: 'ca@ca.com',
    phone: '555-555-5555',
    organization: 'String',
    leadSrc: 'Capgemini Architects Webcast',
    activatedOn: '2017-09-19T14:50:51.307374+00:00'
  };

  const mockPermissions: any = {
    userId: 'd2587542-97c9-11e7-b422-73953baaabfc',
    id: 'copan02',
    viewYipeeCatalog: true,
    yipeeTeamMember: false,
    terms: true,
    paidUser: false,
    downloadKubernetesFiles: false
  };

  class MockUserService {
    constructor() { } // null constructor
    userInfo: any = mockUserInfo;
    permissions: any = mockPermissions;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        YipeeFileService,
        ApiService,
        { provide: UserService, useClass: MockUserService }
      ]
    });
  });

  it('should be created', inject([YipeeFileService], (service: YipeeFileService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to create a k8sfile template', inject([YipeeFileService], (service: YipeeFileService) => {
    const testYipee = service.createNewApp('test name', true);
    expect(testYipee.name).toEqual('test name');
    expect(testYipee.isFlat).toBe(true);
    expect(testYipee.flatFile).toBeDefined();
    expect(testYipee.flatFile.appInfo.name).toBe('test name');
  }));

  it('should be able to fork a yipeefile', inject([YipeeFileService], (service: YipeeFileService) => {
    const testYipee = service.createNewApp('test name', false);
    const forkedYipee = service.forkApp('forked app', testYipee);
    expect(forkedYipee.name).toEqual('forked app');
    expect(forkedYipee.isFlat).toBe(false);
  }));

  it('should be able to fork a k8sfile', inject([YipeeFileService], (service: YipeeFileService) => {
    const testYipee = service.createNewApp('test name', true);
    const forkedYipee = service.forkApp('forked app', testYipee);
    expect(forkedYipee.name).toEqual('forked app');
    expect(forkedYipee.isFlat).toBe(true);
    expect(forkedYipee.flatFile.appInfo.name).toEqual('forked app');
    expect(forkedYipee.flatFile.appInfo.id === testYipee.flatFile.appInfo.id).toBe(true);
  }));

});
