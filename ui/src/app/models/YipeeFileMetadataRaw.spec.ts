import { YipeeFileMetadataRaw } from './YipeeFileMetadataRaw';
import { YipeeFileMetadata } from './YipeeFileMetadata';

const jim2RawData: YipeeFileMetadataRaw[] = [
  {
    '_id': 'a1d44a6c-0b5b-11e8-ac11-f7adb5a8a038',
    'author': 'jd3quist',
    'containers': [
      'one'
    ],
    'dateCreated': '2018-02-06T16:34:41.976076+00:00',
    'dateModified': '2018-02-06T16:36:07.035469+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/e1.yipee',
    'hasLogo': false,
    'id': 'a1d44a6c-0b5b-11e8-ac11-f7adb5a8a038',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'e1',
    'orgname': 'jd3quist',
    'ownerorg': '898b49ba-0b5b-11e8-bb9d-cfc6a6616afe',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': '041bb5c1-75b8-4963-9532-b892659bc5f6',
        'logo': '',
        'name': 'e1',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '4b8ff0ed-673c-428b-9a0b-8014b7d30aee',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'a2206aa0-6acb-4cd0-947d-fe7dd1ee8c05',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 325,
                  'y': 175
                }
              }
            }
          },
          'expose': [
            '80/tcp'
          ],
          'id': 'b3fe2b1f-621a-41c5-9300-cd074b0f84e8',
          'image': 'one',
          'name': 'one',
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': '041bb5c1-75b8-4963-9532-b892659bc5f6',
        'logo': '',
        'name': 'e1',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'services': {
        'one': {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '4b8ff0ed-673c-428b-9a0b-8014b7d30aee',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'a2206aa0-6acb-4cd0-947d-fe7dd1ee8c05',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 325,
                  'y': 175
                }
              }
            }
          },
          'expose': [
            '80/tcp'
          ],
          'id': 'b3fe2b1f-621a-41c5-9300-cd074b0f84e8',
          'image': 'one',
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': '28b19f76-0b5c-11e8-9669-53ba6e9ed833',
    'author': 'jd3quist',
    'containers': [
      'one'
    ],
    'dateCreated': '2018-02-06T16:38:28.241267+00:00',
    'dateModified': '2018-02-06T16:39:15.053482+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/simple.yipee',
    'hasLogo': false,
    'id': '28b19f76-0b5c-11e8-9669-53ba6e9ed833',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'simple',
    'orgname': 'jd3quist',
    'ownerorg': '898b49ba-0b5b-11e8-bb9d-cfc6a6616afe',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': 'bf5f5ada-0607-4abb-bf6d-5155e55f90bc',
        'logo': '[insert name of app logo image here]',
        'name': 'simple',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'be0d787a-90da-4d57-a677-3fc90354fceb',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '8cf5db71-793b-460f-b11d-90333989739a',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'expose': [
            '80/tcp'
          ],
          'id': '820a2b38-2ed0-4eda-8ae4-0008ee6d0867',
          'image': 'one',
          'name': 'one',
          'ports': [
            '80/tcp'
          ],
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': 'bf5f5ada-0607-4abb-bf6d-5155e55f90bc',
        'logo': '[insert name of app logo image here]',
        'name': 'simple',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'services': {
        'one': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'be0d787a-90da-4d57-a677-3fc90354fceb',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '8cf5db71-793b-460f-b11d-90333989739a',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'expose': [
            '80/tcp'
          ],
          'id': '820a2b38-2ed0-4eda-8ae4-0008ee6d0867',
          'image': 'one',
          'ports': [
            '80/tcp'
          ],
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': 'a8cc42ce-0b5c-11e8-893e-cf451c3b5465',
    'author': 'jd3quist',
    'containers': null,
    'dateCreated': '2018-02-06T16:42:03.164394+00:00',
    'dateModified': '2018-02-06T16:42:03.164394+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/e2.yipee',
    'hasLogo': false,
    'id': 'a8cc42ce-0b5c-11e8-893e-cf451c3b5465',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'e2',
    'orgname': 'jd3quist',
    'ownerorg': '898b49ba-0b5b-11e8-bb9d-cfc6a6616afe',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': '4024ccd0-d5a3-4d17-bbce-af8b4f3e6830',
        'logo': '',
        'name': 'e2',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': '4024ccd0-d5a3-4d17-bbce-af8b4f3e6830',
        'logo': '',
        'name': 'e2',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'volumes': {}
    }
  }
];

const jimRawData: YipeeFileMetadataRaw[] = [
  {
    '_id': '66d4cc5d-d8c3-4052-85ba-1085888750f8',
    'author': 'jd3quist',
    'containers': [
      'jdeservice',
      'node-yarn',
      'postgres-uuid',
      'uuid-service'
    ],
    'dateCreated': '2017-01-12T21:50:39.194+00:00',
    'dateModified': '2018-01-30T22:21:08.937111+00:00',
    'downloads': 1177,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/fork.yipee',
    'hasLogo': true,
    'id': '66d4cc5d-d8c3-4052-85ba-1085888750f8',
    'isPrivate': true,
    'likes': 5477,
    'name': 'fork',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 3,
    'revnum': 3,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': 'e4e8d95e-f793-45a8-87e3-63014d4edfab',
        'logo': 'cat-300572_960_720.jpg',
        'name': 'fork',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 185,
                  'y': 400
                }
              }
            }
          },
          'id': 'c4916674-0b8e-4b8e-90fd-c4ea6afc849f',
          'name': 'default',
          'public': true
        }
      ],
      'services': [
        {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '99eca624-0284-4bb1-8b06-9bf061b1c807',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'fafa099a-c7cc-46da-bb74-d23048ffc237',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 825,
                  'y': 550
                }
              }
            }
          },
          'id': '5a3bc5f1-a4ac-4a0e-91db-0485d32039b8',
          'image': 'jde1',
          'name': 'jdeservice',
          'volumes': []
        },
        {
          'annotations': {
            'description': 'Node docker image with yarn package manager ( http://yarnpkg.com )',
            'development_config': {
              'id': '817aa8ea-7f87-49b5-9fec-3a1a5417eb78',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '32836c2c-df70-48ed-be79-890260f41655',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 720,
                  'y': 250
                }
              }
            }
          },
          'id': '076df93f-27a0-4feb-b129-004b66c3b92f',
          'image': 'kkarczmarczyk/node-yarn:latest',
          'name': 'node-yarn',
          'networks': [
            {
              'aliases': [],
              'id': 'd6e7b668-e2a8-450e-97b1-b418538fd51a',
              'name': 'default'
            }
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': 'A simple service for creating &amp; getting UUIDs, provided a key.',
            'development_config': {
              'id': '74810a66-22ac-4e16-ab3a-94437fc7246d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'c315e9fb-829f-4163-afe5-e481f3aab2d1',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            }
          },
          'id': '404ebbff-a79b-4324-85db-5a93e2141773',
          'image': 'conortm/uuid-service:latest',
          'name': 'uuid-service',
          'networks': [
            {
              'aliases': [],
              'id': 'ac76ba84-efae-4f59-a32e-07096a35f8e3',
              'name': 'default'
            }
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': 'The official Postgres Docker image extended with the UUID Support.',
            'development_config': {
              'id': 'e99cafce-d037-4267-91cf-2f1fd7d58141',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '9faaa4d1-15f6-4164-a176-5b5f6e9ecda4',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 420,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'node-yarn'
          ],
          'id': '441a0708-ac91-4b74-aeba-4536dd08b94b',
          'image': 'ntboes/postgres-uuid:latest',
          'name': 'postgres-uuid',
          'networks': [
            {
              'aliases': [],
              'id': '9ee49cb5-48a2-4479-92d1-c762b4ae75d8',
              'name': 'default'
            }
          ],
          'volumes': [
            'volume_0:/v1',
            'volume_1:/v2',
            'volume_2:/v3'
          ]
        }
      ],
      'volumes': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 270,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': '9e173498-22d9-4e6f-9248-5bbe9a2f6685',
          'name': 'volume_0'
        },
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 420,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': 'd595ec65-d8cf-41ad-aaf9-d92369594d54',
          'name': 'volume_1'
        },
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 570,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': '04f7f610-2100-4489-90c0-aa31187d4f76',
          'name': 'volume_2'
        }
      ]
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': 'e4e8d95e-f793-45a8-87e3-63014d4edfab',
        'logo': 'cat-300572_960_720.jpg',
        'name': 'fork',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {
        'default': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 185,
                  'y': 400
                }
              }
            }
          },
          'id': 'c4916674-0b8e-4b8e-90fd-c4ea6afc849f',
          'public': true
        }
      },
      'services': {
        'jdeservice': {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '99eca624-0284-4bb1-8b06-9bf061b1c807',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'fafa099a-c7cc-46da-bb74-d23048ffc237',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 825,
                  'y': 550
                }
              }
            }
          },
          'id': '5a3bc5f1-a4ac-4a0e-91db-0485d32039b8',
          'image': 'jde1',
          'volumes': []
        },
        'node-yarn': {
          'annotations': {
            'description': 'Node docker image with yarn package manager ( http://yarnpkg.com )',
            'development_config': {
              'id': '817aa8ea-7f87-49b5-9fec-3a1a5417eb78',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '32836c2c-df70-48ed-be79-890260f41655',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 720,
                  'y': 250
                }
              }
            }
          },
          'id': '076df93f-27a0-4feb-b129-004b66c3b92f',
          'image': 'kkarczmarczyk/node-yarn:latest',
          'networks': {
            'default': {
              'aliases': [],
              'id': 'd6e7b668-e2a8-450e-97b1-b418538fd51a'
            }
          },
          'volumes': []
        },
        'postgres-uuid': {
          'annotations': {
            'description': 'The official Postgres Docker image extended with the UUID Support.',
            'development_config': {
              'id': 'e99cafce-d037-4267-91cf-2f1fd7d58141',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '9faaa4d1-15f6-4164-a176-5b5f6e9ecda4',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 420,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'node-yarn'
          ],
          'id': '441a0708-ac91-4b74-aeba-4536dd08b94b',
          'image': 'ntboes/postgres-uuid:latest',
          'networks': {
            'default': {
              'aliases': [],
              'id': '9ee49cb5-48a2-4479-92d1-c762b4ae75d8'
            }
          },
          'volumes': [
            'volume_0:/v1',
            'volume_1:/v2',
            'volume_2:/v3'
          ]
        },
        'uuid-service': {
          'annotations': {
            'description': 'A simple service for creating &amp; getting UUIDs, provided a key.',
            'development_config': {
              'id': '74810a66-22ac-4e16-ab3a-94437fc7246d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'c315e9fb-829f-4163-afe5-e481f3aab2d1',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            }
          },
          'id': '404ebbff-a79b-4324-85db-5a93e2141773',
          'image': 'conortm/uuid-service:latest',
          'networks': {
            'default': {
              'aliases': [],
              'id': 'ac76ba84-efae-4f59-a32e-07096a35f8e3'
            }
          },
          'volumes': []
        }
      },
      'volumes': {
        'volume_0': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 270,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': '9e173498-22d9-4e6f-9248-5bbe9a2f6685'
        },
        'volume_1': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 420,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': 'd595ec65-d8cf-41ad-aaf9-d92369594d54'
        },
        'volume_2': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'position': {
                  'x': 570,
                  'y': 250
                }
              }
            }
          },
          'driver': 'local',
          'id': '04f7f610-2100-4489-90c0-aa31187d4f76'
        }
      }
    }
  },
  {
    '_id': '5769b9b2-06d3-11e8-9fbf-8f616c2b770a',
    'author': 'jd3quist',
    'containers': [
      'one'
    ],
    'dateCreated': '2018-01-31T22:09:00.919402+00:00',
    'dateModified': '2018-01-31T22:09:00.919402+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/oink.yipee',
    'hasLogo': false,
    'id': '5769b9b2-06d3-11e8-9fbf-8f616c2b770a',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'oink',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': 'cc0d1f10-c911-4995-b103-282fa5be9b36',
        'logo': '[insert name of app logo image here]',
        'name': 'oink'
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '',
            'ui': {}
          },
          'expose': [
            '80',
            '8080/tcp'
          ],
          'id': '437afba0-a041-4005-a70b-984bc3acee0e',
          'image': 'one',
          'name': 'one',
          'ports': [
            '80',
            '8080/tcp',
            'foobar:8000:80/tcp'
          ],
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': 'cc0d1f10-c911-4995-b103-282fa5be9b36',
        'logo': '[insert name of app logo image here]',
        'name': 'oink'
      },
      'networks': {},
      'services': {
        'one': {
          'annotations': {
            'description': '',
            'ui': {}
          },
          'expose': [
            '80',
            '8080/tcp'
          ],
          'id': '437afba0-a041-4005-a70b-984bc3acee0e',
          'image': 'one',
          'ports': [
            '80',
            '8080/tcp',
            'foobar:8000:80/tcp'
          ],
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': 'a87d55c6-06d7-11e8-90be-6b709116f176',
    'author': 'jd3quist',
    'containers': [
      'one'
    ],
    'dateCreated': '2018-01-31T22:39:54.930963+00:00',
    'dateModified': '2018-01-31T22:39:54.930963+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/snort.yipee',
    'hasLogo': false,
    'id': 'a87d55c6-06d7-11e8-90be-6b709116f176',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'snort',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': '7e95daad-e42f-4a0e-bfa9-ac09814bdca9',
        'logo': '[insert name of app logo image here]',
        'name': 'snort'
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '',
            'ui': {}
          },
          'expose': [
            '80',
            '8080/tcp'
          ],
          'id': 'fa97b2e4-44b9-49b8-a04f-cfd092edc2c2',
          'image': 'one',
          'name': 'one',
          'ports': [
            '80',
            '8080/tcp',
            '10.0.0.1:8080:80/tcp'
          ],
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': '7e95daad-e42f-4a0e-bfa9-ac09814bdca9',
        'logo': '[insert name of app logo image here]',
        'name': 'snort'
      },
      'networks': {},
      'services': {
        'one': {
          'annotations': {
            'description': '',
            'ui': {}
          },
          'expose': [
            '80',
            '8080/tcp'
          ],
          'id': 'fa97b2e4-44b9-49b8-a04f-cfd092edc2c2',
          'image': 'one',
          'ports': [
            '80',
            '8080/tcp',
            '10.0.0.1:8080:80/tcp'
          ],
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': 'bc211a86-02d6-11e8-beef-6f5f0cf6babe',
    'author': 'jd3quist',
    'containers': [
      'db',
      'nginx',
      'redmine'
    ],
    'dateCreated': '2018-01-26T20:23:13.730727+00:00',
    'dateModified': '2018-01-26T20:23:17.36261+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/bday4.yipee',
    'hasLogo': false,
    'id': 'bc211a86-02d6-11e8-beef-6f5f0cf6babe',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'bday4',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': 'd9206b6b-6e8d-4da4-92a6-f4597ec51996',
        'logo': '[insert name of app logo image here]',
        'name': 'bday4',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [
        {
          'annotations': {
            'description': '[insert description of network here]',
            'ui': {
              'canvas': {
                'id': '60b73ac8-adee-0710-1c12-94b20bf4bdad',
                'position': {
                  'x': 485,
                  'y': 550
                }
              }
            }
          },
          'driver': 'overlay',
          'id': '7b668d53-09e5-49f2-944c-60a5be310948',
          'name': 'backend'
        }
      ],
      'services': [
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '8963e631-e900-4c50-bc79-899ef2196ba7',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '5d7fe7cb-458b-443d-987b-6a0196f2006f',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'a0a76012-4125-10eb-f6c1-866817917463',
                'position': {
                  'x': 110,
                  'y': 400
                }
              }
            }
          },
          'build': 'mysql',
          'deploy': {
            'count': 1,
            'id': '6137ed47-e5f3-464d-a0fc-1de5beb1d34c',
            'mode': 'replicated'
          },
          'environment': [
            'MYSQL_DATABASE=redmine',
            'MYSQL_PASSWORD=r3dmin3',
            'MYSQL_ROOT_PASSWORD=s3cr3t',
            'MYSQL_USER=redmine'
          ],
          'id': '8be8cc01-05ad-41a2-a793-7e07b96bf383',
          'image': 'birthday_mysql:1.0',
          'name': 'db',
          'networks': [
            {
              'aliases': [],
              'id': '542d3b94-3665-45f9-8145-0baa14318719',
              'name': 'backend'
            }
          ],
          'volumes': [
            'mysql_data:/var/lib/mysql'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '19a7bf37-e1c0-4dd6-912a-6659062b15c5',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'c94209bc-b7a5-4546-b842-c91eb2c0d20f',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'f4fe41a1-3f29-039b-784b-0453740fa4e4',
                'position': {
                  'x': 515,
                  'y': 100
                }
              }
            }
          },
          'build': 'nginx',
          'depends_on': [
            'redmine'
          ],
          'deploy': {
            'count': 1,
            'id': 'ac24aeb2-64eb-4e21-925e-a030b9edfa08',
            'mode': 'allnodes'
          },
          'healthcheck': {
            'healthcmd': [
              '/bin/sh',
              '-c',
              'curl -f http://localhost/ || exit 1'
            ],
            'id': '15d1ef24-6130-41fb-b237-e7ffb0873f1e',
            'interval': 60,
            'retries': 3,
            'timeout': 10
          },
          'id': '82392e1a-dd1a-45eb-b82e-35dbde91821d',
          'image': 'bday4-4:5000/nginx:1.0',
          'name': 'nginx',
          'networks': [
            {
              'aliases': [],
              'id': 'cd026768-25b8-4115-bb5a-e3cbcedcd89b',
              'name': 'backend'
            }
          ],
          'ports': [
            '80:80'
          ],
          'volumes': [
            'redmine_public:/usr/src/redmine/public'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '33211a35-0374-4a97-b1c5-c78f7e8a774d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '68f17544-9cea-4ad7-a675-f000688f3d94',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '0783cbdc-cac9-28b5-721d-6ab704a3bd10',
                'position': {
                  'x': 335,
                  'y': 250
                }
              }
            }
          },
          'build': 'redmine',
          'depends_on': [
            'db'
          ],
          'deploy': {
            'count': 1,
            'id': '74980aa7-aee7-404b-9cc6-e1b72e8a0b90',
            'mode': 'replicated'
          },
          'environment': [
            'REDMINE_DB_MYSQL=bday_db',
            'REDMINE_DB_PASSWORD=r3dmin3',
            'REDMINE_DB_USERNAME=redmine'
          ],
          'healthcheck': {
            'healthcmd': [
              '/bin/sh',
              '-c',
              'curl -f http://localhost:3000/ || exit 1'
            ],
            'id': 'e1a2ba95-e4fa-48c5-add4-25651f31870c',
            'interval': 60,
            'retries': 3,
            'timeout': 10
          },
          'id': '822ef9fd-879a-4c78-b4ff-612e7b50975e',
          'image': 'bday4-4:5000/redmine:1.0',
          'name': 'redmine',
          'networks': [
            {
              'aliases': [],
              'id': '67e2de97-740d-46c2-9065-e37051ac8b3f',
              'name': 'backend'
            }
          ],
          'volumes': [
            'redmine_files:/usr/src/redmine/files',
            'redmine_public:/usr/src/redmine/public'
          ]
        }
      ],
      'volumes': [
        {
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': '30ef6b3a-3ebe-4eec-2403-bd1746d0e68d',
                'position': {
                  'x': 260,
                  'y': 400
                }
              }
            }
          },
          'driver': 'convoy',
          'id': '15b2234f-5bf2-4740-8dc9-88edd6728c20',
          'name': 'redmine_files'
        },
        {
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'bc54f4c8-19d4-5d49-600b-de7b70449d00',
                'position': {
                  'x': 410,
                  'y': 400
                }
              }
            }
          },
          'driver': 'convoy',
          'id': '786d2adf-e27f-4304-9855-e64ac0931d50',
          'name': 'redmine_public'
        },
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '8ebe8af3-36f3-da8b-7168-52ea063a8b56',
                'position': {
                  'x': 100,
                  'y': 550
                }
              }
            }
          },
          'id': '8b27b0ff-0197-4850-b9a1-541b80cb6067',
          'name': 'mysql_data'
        }
      ]
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': 'd9206b6b-6e8d-4da4-92a6-f4597ec51996',
        'logo': '[insert name of app logo image here]',
        'name': 'bday4',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {
        'backend': {
          'annotations': {
            'description': '[insert description of network here]',
            'ui': {
              'canvas': {
                'id': '60b73ac8-adee-0710-1c12-94b20bf4bdad',
                'position': {
                  'x': 485,
                  'y': 550
                }
              }
            }
          },
          'driver': 'overlay',
          'id': '7b668d53-09e5-49f2-944c-60a5be310948'
        }
      },
      'services': {
        'db': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '8963e631-e900-4c50-bc79-899ef2196ba7',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '5d7fe7cb-458b-443d-987b-6a0196f2006f',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'a0a76012-4125-10eb-f6c1-866817917463',
                'position': {
                  'x': 110,
                  'y': 400
                }
              }
            }
          },
          'build': 'mysql',
          'deploy': {
            'count': 1,
            'id': '6137ed47-e5f3-464d-a0fc-1de5beb1d34c',
            'mode': 'replicated'
          },
          'environment': [
            'MYSQL_DATABASE=redmine',
            'MYSQL_PASSWORD=r3dmin3',
            'MYSQL_ROOT_PASSWORD=s3cr3t',
            'MYSQL_USER=redmine'
          ],
          'id': '8be8cc01-05ad-41a2-a793-7e07b96bf383',
          'image': 'birthday_mysql:1.0',
          'networks': {
            'backend': {
              'aliases': [],
              'id': '542d3b94-3665-45f9-8145-0baa14318719'
            }
          },
          'volumes': [
            'mysql_data:/var/lib/mysql'
          ]
        },
        'nginx': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '19a7bf37-e1c0-4dd6-912a-6659062b15c5',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'c94209bc-b7a5-4546-b842-c91eb2c0d20f',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'f4fe41a1-3f29-039b-784b-0453740fa4e4',
                'position': {
                  'x': 515,
                  'y': 100
                }
              }
            }
          },
          'build': 'nginx',
          'depends_on': [
            'redmine'
          ],
          'deploy': {
            'count': 1,
            'id': 'ac24aeb2-64eb-4e21-925e-a030b9edfa08',
            'mode': 'allnodes'
          },
          'healthcheck': {
            'healthcmd': [
              '/bin/sh',
              '-c',
              'curl -f http://localhost/ || exit 1'
            ],
            'id': '15d1ef24-6130-41fb-b237-e7ffb0873f1e',
            'interval': 60,
            'retries': 3,
            'timeout': 10
          },
          'id': '82392e1a-dd1a-45eb-b82e-35dbde91821d',
          'image': 'bday4-4:5000/nginx:1.0',
          'networks': {
            'backend': {
              'aliases': [],
              'id': 'cd026768-25b8-4115-bb5a-e3cbcedcd89b'
            }
          },
          'ports': [
            '80:80'
          ],
          'volumes': [
            'redmine_public:/usr/src/redmine/public'
          ]
        },
        'redmine': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '33211a35-0374-4a97-b1c5-c78f7e8a774d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '68f17544-9cea-4ad7-a675-f000688f3d94',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '0783cbdc-cac9-28b5-721d-6ab704a3bd10',
                'position': {
                  'x': 335,
                  'y': 250
                }
              }
            }
          },
          'build': 'redmine',
          'depends_on': [
            'db'
          ],
          'deploy': {
            'count': 1,
            'id': '74980aa7-aee7-404b-9cc6-e1b72e8a0b90',
            'mode': 'replicated'
          },
          'environment': [
            'REDMINE_DB_MYSQL=bday_db',
            'REDMINE_DB_PASSWORD=r3dmin3',
            'REDMINE_DB_USERNAME=redmine'
          ],
          'healthcheck': {
            'healthcmd': [
              '/bin/sh',
              '-c',
              'curl -f http://localhost:3000/ || exit 1'
            ],
            'id': 'e1a2ba95-e4fa-48c5-add4-25651f31870c',
            'interval': 60,
            'retries': 3,
            'timeout': 10
          },
          'id': '822ef9fd-879a-4c78-b4ff-612e7b50975e',
          'image': 'bday4-4:5000/redmine:1.0',
          'networks': {
            'backend': {
              'aliases': [],
              'id': '67e2de97-740d-46c2-9065-e37051ac8b3f'
            }
          },
          'volumes': [
            'redmine_files:/usr/src/redmine/files',
            'redmine_public:/usr/src/redmine/public'
          ]
        }
      },
      'volumes': {
        'mysql_data': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '8ebe8af3-36f3-da8b-7168-52ea063a8b56',
                'position': {
                  'x': 100,
                  'y': 550
                }
              }
            }
          },
          'id': '8b27b0ff-0197-4850-b9a1-541b80cb6067'
        },
        'redmine_files': {
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': '30ef6b3a-3ebe-4eec-2403-bd1746d0e68d',
                'position': {
                  'x': 260,
                  'y': 400
                }
              }
            }
          },
          'driver': 'convoy',
          'id': '15b2234f-5bf2-4740-8dc9-88edd6728c20'
        },
        'redmine_public': {
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'bc54f4c8-19d4-5d49-600b-de7b70449d00',
                'position': {
                  'x': 410,
                  'y': 400
                }
              }
            }
          },
          'driver': 'convoy',
          'id': '786d2adf-e27f-4304-9855-e64ac0931d50'
        }
      }
    }
  },
  {
    '_id': 'c6753094-02d6-11e8-b983-2b37da2ef53a',
    'author': 'jd3quist',
    'containers': [
      'db',
      'redis',
      'result',
      'vote',
      'worker'
    ],
    'dateCreated': '2018-01-26T20:23:31.05956+00:00',
    'dateModified': '2018-01-26T20:23:34.761883+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/eva.yipee',
    'hasLogo': false,
    'id': 'c6753094-02d6-11e8-b983-2b37da2ef53a',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'eva',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': 'a2d7df60-8075-4a17-99e8-68805f59d931',
        'logo': '[insert name of app logo image here]',
        'name': 'eva',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'ae8fe6e7-0a8f-1a71-abfb-39593bdd0e21',
                'position': {
                  'x': 270,
                  'y': 250
                }
              }
            }
          },
          'id': '5631d0a8-ac40-4793-a253-8d1d80ad8747',
          'name': 'back-tier'
        },
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'eaadd338-12f7-e38e-8024-7d4260002b4f',
                'position': {
                  'x': 550,
                  'y': 250
                }
              }
            }
          },
          'id': '8cdd0fa0-62a0-4a60-ae10-8ca1073f14dc',
          'name': 'front-tier'
        }
      ],
      'services': [
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'c30c3092-5a5e-41b7-be54-82b7529bbf0d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '82091f2a-efc6-4988-a33d-709c56bcb911',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '3288e126-c056-dcb0-3d7a-a2c289357768',
                'position': {
                  'x': 400,
                  'y': 100
                }
              }
            }
          },
          'build': './result',
          'command': 'nodemon --debug server.js',
          'id': 'fd3996f8-861a-4946-b476-bc2b55d7c91a',
          'image': 'yipee/required',
          'name': 'result',
          'networks': [
            {
              'aliases': [],
              'id': 'abcd1842-32ac-4859-b09f-5d52cf308a06',
              'name': 'back-tier'
            },
            {
              'aliases': [],
              'id': '67a72ee5-6877-40c0-b829-3b511e04e15d',
              'name': 'front-tier'
            }
          ],
          'ports': [
            '5001:80',
            '5858:5858'
          ],
          'volumes': [
            './result:/app'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '10f69c86-08b4-477b-b926-1974a326bb63',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '1cfbce98-8c6b-4cdf-9dee-bb0f3297b8c9',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'a55bf927-ad55-94ec-a7e7-84e8e0ade6d3',
                'position': {
                  'x': 700,
                  'y': 100
                }
              }
            }
          },
          'id': '032028b0-1661-4d6c-a13a-0ce3e0284f02',
          'image': 'postgres:9.4',
          'name': 'db',
          'networks': [
            {
              'aliases': [],
              'id': '29954d9e-12ab-425e-b162-cf28370c90cd',
              'name': 'back-tier'
            }
          ],
          'volumes': [
            'db-data:/var/lib/postgresql/data'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '9c4f56dd-f5d8-49e0-9384-8358f663c1fd',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'f954198b-510b-4bad-ae57-3807f20661db',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'ad49a807-7483-99c5-2638-839e497c7ec8',
                'position': {
                  'x': 550,
                  'y': 100
                }
              }
            }
          },
          'build': './vote',
          'command': 'python app.py',
          'id': '002d5b76-2477-40b5-b718-56a508b0e222',
          'image': 'yipee/required',
          'name': 'vote',
          'networks': [
            {
              'aliases': [],
              'id': 'e88de3fc-9a15-40a1-b616-5ac9a31ba13a',
              'name': 'back-tier'
            },
            {
              'aliases': [],
              'id': '250d11ba-b148-4d9e-9679-b7c62b3d6410',
              'name': 'front-tier'
            }
          ],
          'ports': [
            '5000:80'
          ],
          'volumes': [
            './vote:/app'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '73f59119-a479-4204-a834-a6540a4fc84b',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'e30d2c9c-031a-42e5-8ee3-5bf8a5623f7c',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'b4327a36-4a60-b075-ee04-1db388efdb1d',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'build': './worker',
          'id': '9046126c-74ad-4418-8d20-cbdc1a73997f',
          'image': 'yipee/required',
          'name': 'worker',
          'networks': [
            {
              'aliases': [],
              'id': 'e423317b-1e49-4541-b013-83c096c467d8',
              'name': 'back-tier'
            }
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '87ada968-09d3-4f6f-9b15-49b91e02d7e7',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'bfeafd59-3546-43e4-9d4b-a5e0c5569a42',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'e842ab83-f45e-36b6-6f1c-efd37017d975',
                'position': {
                  'x': 250,
                  'y': 100
                }
              }
            }
          },
          'id': '55b1658f-dcf0-4e80-a586-767f97a6118f',
          'image': 'redis:alpine',
          'name': 'redis',
          'networks': [
            {
              'aliases': [],
              'id': '791a7748-8ce6-4f11-9e63-b4a38ef601c4',
              'name': 'back-tier'
            }
          ],
          'ports': [
            '6'
          ],
          'volumes': []
        }
      ],
      'volumes': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '9726c89f-1bd3-2cb1-ad4b-14b66e88c8ae',
                'position': {
                  'x': 700,
                  'y': 250
                }
              }
            }
          },
          'id': '2a5cad3b-ba2d-4725-a71e-758bcc569a8b',
          'name': 'db-data'
        }
      ]
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': 'a2d7df60-8075-4a17-99e8-68805f59d931',
        'logo': '[insert name of app logo image here]',
        'name': 'eva',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {
        'back-tier': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'ae8fe6e7-0a8f-1a71-abfb-39593bdd0e21',
                'position': {
                  'x': 270,
                  'y': 250
                }
              }
            }
          },
          'id': '5631d0a8-ac40-4793-a253-8d1d80ad8747'
        },
        'front-tier': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'eaadd338-12f7-e38e-8024-7d4260002b4f',
                'position': {
                  'x': 550,
                  'y': 250
                }
              }
            }
          },
          'id': '8cdd0fa0-62a0-4a60-ae10-8ca1073f14dc'
        }
      },
      'services': {
        'db': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '10f69c86-08b4-477b-b926-1974a326bb63',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '1cfbce98-8c6b-4cdf-9dee-bb0f3297b8c9',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'a55bf927-ad55-94ec-a7e7-84e8e0ade6d3',
                'position': {
                  'x': 700,
                  'y': 100
                }
              }
            }
          },
          'id': '032028b0-1661-4d6c-a13a-0ce3e0284f02',
          'image': 'postgres:9.4',
          'networks': {
            'back-tier': {
              'aliases': [],
              'id': '29954d9e-12ab-425e-b162-cf28370c90cd'
            }
          },
          'volumes': [
            'db-data:/var/lib/postgresql/data'
          ]
        },
        'redis': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '87ada968-09d3-4f6f-9b15-49b91e02d7e7',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'bfeafd59-3546-43e4-9d4b-a5e0c5569a42',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'e842ab83-f45e-36b6-6f1c-efd37017d975',
                'position': {
                  'x': 250,
                  'y': 100
                }
              }
            }
          },
          'id': '55b1658f-dcf0-4e80-a586-767f97a6118f',
          'image': 'redis:alpine',
          'networks': {
            'back-tier': {
              'aliases': [],
              'id': '791a7748-8ce6-4f11-9e63-b4a38ef601c4'
            }
          },
          'ports': [
            '6'
          ],
          'volumes': []
        },
        'result': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'c30c3092-5a5e-41b7-be54-82b7529bbf0d',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '82091f2a-efc6-4988-a33d-709c56bcb911',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '3288e126-c056-dcb0-3d7a-a2c289357768',
                'position': {
                  'x': 400,
                  'y': 100
                }
              }
            }
          },
          'build': './result',
          'command': 'nodemon --debug server.js',
          'id': 'fd3996f8-861a-4946-b476-bc2b55d7c91a',
          'image': 'yipee/required',
          'networks': {
            'back-tier': {
              'aliases': [],
              'id': 'abcd1842-32ac-4859-b09f-5d52cf308a06'
            },
            'front-tier': {
              'aliases': [],
              'id': '67a72ee5-6877-40c0-b829-3b511e04e15d'
            }
          },
          'ports': [
            '5001:80',
            '5858:5858'
          ],
          'volumes': [
            './result:/app'
          ]
        },
        'vote': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '9c4f56dd-f5d8-49e0-9384-8358f663c1fd',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'f954198b-510b-4bad-ae57-3807f20661db',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'ad49a807-7483-99c5-2638-839e497c7ec8',
                'position': {
                  'x': 550,
                  'y': 100
                }
              }
            }
          },
          'build': './vote',
          'command': 'python app.py',
          'id': '002d5b76-2477-40b5-b718-56a508b0e222',
          'image': 'yipee/required',
          'networks': {
            'back-tier': {
              'aliases': [],
              'id': 'e88de3fc-9a15-40a1-b616-5ac9a31ba13a'
            },
            'front-tier': {
              'aliases': [],
              'id': '250d11ba-b148-4d9e-9679-b7c62b3d6410'
            }
          },
          'ports': [
            '5000:80'
          ],
          'volumes': [
            './vote:/app'
          ]
        },
        'worker': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '73f59119-a479-4204-a834-a6540a4fc84b',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'e30d2c9c-031a-42e5-8ee3-5bf8a5623f7c',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'b4327a36-4a60-b075-ee04-1db388efdb1d',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'build': './worker',
          'id': '9046126c-74ad-4418-8d20-cbdc1a73997f',
          'image': 'yipee/required',
          'networks': {
            'back-tier': {
              'aliases': [],
              'id': 'e423317b-1e49-4541-b013-83c096c467d8'
            }
          },
          'volumes': []
        }
      },
      'volumes': {
        'db-data': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '9726c89f-1bd3-2cb1-ad4b-14b66e88c8ae',
                'position': {
                  'x': 700,
                  'y': 250
                }
              }
            }
          },
          'id': '2a5cad3b-ba2d-4725-a71e-758bcc569a8b'
        }
      }
    }
  },
  {
    '_id': 'dc1c013e-02d6-11e8-b479-47b32176503f',
    'author': 'jd3quist',
    'containers': [
      'one'
    ],
    'dateCreated': '2018-01-26T20:24:07.386639+00:00',
    'dateModified': '2018-01-26T20:24:10.718637+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/simple.yipee',
    'hasLogo': false,
    'id': 'dc1c013e-02d6-11e8-b479-47b32176503f',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'simple',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': '5243a2e9-e8ca-4e15-9283-bd111faf0019',
        'logo': '[insert name of app logo image here]',
        'name': 'simple',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '05483d71-1b4e-4fd4-b098-6c951f5a4878',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'e18d1ca0-fa08-4d2f-a1df-3552cbde981d',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '2bb18096-9498-30d1-728d-8ca9ece4db34',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'id': '34736d80-2226-42ff-9f88-6889de664cc6',
          'image': 'one',
          'name': 'one',
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': '5243a2e9-e8ca-4e15-9283-bd111faf0019',
        'logo': '[insert name of app logo image here]',
        'name': 'simple',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'services': {
        'one': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '05483d71-1b4e-4fd4-b098-6c951f5a4878',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'e18d1ca0-fa08-4d2f-a1df-3552cbde981d',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '2bb18096-9498-30d1-728d-8ca9ece4db34',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'id': '34736d80-2226-42ff-9f88-6889de664cc6',
          'image': 'one',
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': '0665c6d2-02d7-11e8-a641-c34a4635c2fc',
    'author': 'jd3quist',
    'containers': [
      'foo'
    ],
    'dateCreated': '2018-01-26T20:25:18.33343+00:00',
    'dateModified': '2018-01-26T20:32:26.644368+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/emptynomore.yipee',
    'hasLogo': false,
    'id': '0665c6d2-02d7-11e8-a641-c34a4635c2fc',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'emptynomore',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': '557ad252-0fb9-48bd-bb10-539db6033bbd',
        'logo': '',
        'name': 'emptynomore',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'services': [
        {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '95b63455-3470-41a9-a113-658080d1a309',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'fbe34935-3391-40ba-84c0-3f838eab5a84',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '25a20ec8-bd6b-a989-1adb-adb128311373',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'id': '2a908a8f-aa1c-4993-89ed-efeec36109b8',
          'image': 'foo',
          'name': 'foo',
          'volumes': []
        }
      ],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': '557ad252-0fb9-48bd-bb10-539db6033bbd',
        'logo': '',
        'name': 'emptynomore',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'services': {
        'foo': {
          'annotations': {
            'description': '',
            'development_config': {
              'id': '95b63455-3470-41a9-a113-658080d1a309',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'fbe34935-3391-40ba-84c0-3f838eab5a84',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '25a20ec8-bd6b-a989-1adb-adb128311373',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          },
          'id': '2a908a8f-aa1c-4993-89ed-efeec36109b8',
          'image': 'foo',
          'volumes': []
        }
      },
      'volumes': {}
    }
  },
  {
    '_id': 'e5714eaa-02d7-11e8-9c6d-871769557661',
    'author': 'jd3quist',
    'containers': [],
    'dateCreated': '2018-01-26T20:31:32.540998+00:00',
    'dateModified': '2018-01-26T20:31:32.540998+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/empty3.yipee',
    'hasLogo': false,
    'id': 'e5714eaa-02d7-11e8-9c6d-871769557661',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'empty3',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': 'acdaa063-844a-45c5-b8dc-18940c3d1bad',
        'logo': '',
        'name': 'empty3',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': 'acdaa063-844a-45c5-b8dc-18940c3d1bad',
        'logo': '',
        'name': 'empty3',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'volumes': {}
    }
  },
  {
    '_id': '9970aedc-012f-11e8-9877-93bf26ce8a50',
    'author': 'jd3quist',
    'containers': [],
    'dateCreated': '2018-01-24T17:54:18.415337+00:00',
    'dateModified': '2018-01-24T17:54:18.415337+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/tiny.yipee',
    'hasLogo': false,
    'id': '9970aedc-012f-11e8-9877-93bf26ce8a50',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'tiny',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': '460f005e-dc24-49be-b9b6-db9e1d87dfac',
        'logo': '',
        'name': 'tiny',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': '460f005e-dc24-49be-b9b6-db9e1d87dfac',
        'logo': '',
        'name': 'tiny',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'volumes': {}
    }
  },
  {
    '_id': 'd04c7258-02d6-11e8-b478-ff3efe9493ef',
    'author': 'jd3quist',
    'containers': [
      'db',
      'redis',
      'result',
      'visualizer',
      'vote',
      'worker'
    ],
    'dateCreated': '2018-01-26T20:23:47.570357+00:00',
    'dateModified': '2018-01-26T20:23:51.407947+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/evas.yipee',
    'hasLogo': false,
    'id': 'd04c7258-02d6-11e8-b478-ff3efe9493ef',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'evas',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '[insert app description here]',
        'id': 'f52a7d90-d538-4406-8b41-f2cf700c629c',
        'logo': '[insert name of app logo image here]',
        'name': 'evas',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '2fce0162-79c6-69a8-3eb0-6fa949ddbc75',
                'position': {
                  'x': 400,
                  'y': 400
                }
              }
            }
          },
          'id': '02e695a3-ebfb-411a-912c-34c6bac1f6d2',
          'name': 'frontend'
        },
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '3ed3c6d4-c376-ba21-baa2-0a4ee08030e6',
                'position': {
                  'x': 250,
                  'y': 400
                }
              }
            }
          },
          'id': '13ba471e-4473-475c-a6b8-64acf87222cb',
          'name': 'backend'
        }
      ],
      'services': [
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '1eef319d-8d72-44bb-ba34-c5cb15aecb76',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '03467c64-0ef2-4493-9852-1d421c5a9513',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'cfc82298-2f71-e06c-6b6d-702609cbc044',
                'position': {
                  'x': 452.5,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'redis'
          ],
          'deploy': {
            'count': 2,
            'id': '8a4fb74e-8638-44dc-aed7-d765ac25d16a',
            'mode': 'replicated'
          },
          'id': 'b8e700fe-47e4-4169-8e05-c9c8c9edf39f',
          'image': 'dockersamples/examplevotingapp_vote:before',
          'name': 'vote',
          'networks': [
            {
              'aliases': [],
              'id': 'b0e63680-e30b-4b91-bd6c-774ae9a1123b',
              'name': 'frontend'
            }
          ],
          'ports': [
            '5000:80'
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '593c50a5-e43e-4103-96d2-0081d2f74010',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'dc4e9e1d-6606-400f-b187-0f2913809de4',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '1c8828ae-9ef1-e145-f8c1-9ce90fa1465c',
                'position': {
                  'x': 302.5,
                  'y': 100
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': 'bbcdb918-06c3-4fd0-9eb3-5289b21592e3',
            'mode': 'replicated'
          },
          'id': 'c47dcde4-1f0a-4786-965e-454b05d3b3b3',
          'image': 'dockersamples/visualizer:stable',
          'name': 'visualizer',
          'ports': [
            '8080:8080'
          ],
          'volumes': [
            '/var/run/docker.sock:/var/run/docker.sock'
          ]
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '71818d2b-c85c-400e-8576-f35794e9f77e',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '246be462-b37e-459b-bf03-2b679a796cb1',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'dc349f1b-6487-0883-200e-da3a070d8b3d',
                'position': {
                  'x': 302.5,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': '26d71303-3c35-4cba-9924-07352724bb49',
            'mode': 'replicated'
          },
          'id': '60e2a2bf-2709-4733-b521-8195587c3fac',
          'image': 'dockersamples/examplevotingapp_worker',
          'name': 'worker',
          'networks': [
            {
              'aliases': [],
              'id': 'f5b896a1-2c3e-49ce-978d-2201a4cc4f5c',
              'name': 'backend'
            },
            {
              'aliases': [],
              'id': '04815d80-3eac-44ac-83d6-014faee175da',
              'name': 'frontend'
            }
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '0257474c-e29d-42ca-b674-ee11a6225daa',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '32294e8f-ef1c-448e-beef-b641d2640fc5',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '003c8ce3-6283-f8f3-a00f-9c29ee060d44',
                'position': {
                  'x': 142.5,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'db'
          ],
          'deploy': {
            'count': 1,
            'id': 'd66956e3-8d2a-4fb5-bbaa-b81b28d18237',
            'mode': 'replicated'
          },
          'id': 'c3f4bf2e-dfc4-4511-b025-ac747027c895',
          'image': 'dockersamples/examplevotingapp_result:before',
          'name': 'result',
          'networks': [
            {
              'aliases': [],
              'id': 'b70ffd49-343d-4839-a278-49d12f7ee5a1',
              'name': 'backend'
            }
          ],
          'ports': [
            '5001:80'
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'a255e888-c332-4368-a765-4c9fb0a67a9f',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '878e7cf5-967e-4f37-940c-5ccee828aaab',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '076d896b-9502-fe1b-d8a8-1230ea54c225',
                'position': {
                  'x': 485,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 2,
            'id': 'fbbe0e3c-f136-42b8-82bb-912b22f37f75',
            'mode': 'replicated'
          },
          'id': 'a362d0fa-c630-4dc4-ab85-c55fa5c3bb10',
          'image': 'redis:alpine',
          'name': 'redis',
          'networks': [
            {
              'aliases': [],
              'id': '4c5c145a-576e-4236-9877-936abbe96332',
              'name': 'frontend'
            }
          ],
          'ports': [
            '6'
          ],
          'volumes': []
        },
        {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'f9b22485-32d8-4fbb-bb06-8b9b0e60450e',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'f1393ca3-e441-435c-bdfc-2208847b5594',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'ae900da1-54fd-030e-efc8-14bcd268d302',
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': 'e2258add-e35b-46b6-a31d-700bb85b40b7',
            'mode': 'replicated'
          },
          'id': '57f125df-7fa6-4068-95ca-c90e3840c7c9',
          'image': 'postgres:9.4',
          'name': 'db',
          'networks': [
            {
              'aliases': [],
              'id': '46683742-50a0-42de-94fe-d061b753e111',
              'name': 'backend'
            }
          ],
          'volumes': [
            'db-data:/var/lib/postgresql/data'
          ]
        }
      ],
      'volumes': [
        {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'e22a72f5-59b2-a536-481a-599289603b7f',
                'position': {
                  'x': 100,
                  'y': 400
                }
              }
            }
          },
          'id': '50c2df32-b1fa-4707-8f24-1f54f1529be6',
          'name': 'db-data'
        }
      ]
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '[insert app description here]',
        'id': 'f52a7d90-d538-4406-8b41-f2cf700c629c',
        'logo': '[insert name of app logo image here]',
        'name': 'evas',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {
        'backend': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '3ed3c6d4-c376-ba21-baa2-0a4ee08030e6',
                'position': {
                  'x': 250,
                  'y': 400
                }
              }
            }
          },
          'id': '13ba471e-4473-475c-a6b8-64acf87222cb'
        },
        'frontend': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': '2fce0162-79c6-69a8-3eb0-6fa949ddbc75',
                'position': {
                  'x': 400,
                  'y': 400
                }
              }
            }
          },
          'id': '02e695a3-ebfb-411a-912c-34c6bac1f6d2'
        }
      },
      'services': {
        'db': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'f9b22485-32d8-4fbb-bb06-8b9b0e60450e',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'f1393ca3-e441-435c-bdfc-2208847b5594',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'ae900da1-54fd-030e-efc8-14bcd268d302',
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': 'e2258add-e35b-46b6-a31d-700bb85b40b7',
            'mode': 'replicated'
          },
          'id': '57f125df-7fa6-4068-95ca-c90e3840c7c9',
          'image': 'postgres:9.4',
          'networks': {
            'backend': {
              'aliases': [],
              'id': '46683742-50a0-42de-94fe-d061b753e111'
            }
          },
          'volumes': [
            'db-data:/var/lib/postgresql/data'
          ]
        },
        'redis': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': 'a255e888-c332-4368-a765-4c9fb0a67a9f',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '878e7cf5-967e-4f37-940c-5ccee828aaab',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '076d896b-9502-fe1b-d8a8-1230ea54c225',
                'position': {
                  'x': 485,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 2,
            'id': 'fbbe0e3c-f136-42b8-82bb-912b22f37f75',
            'mode': 'replicated'
          },
          'id': 'a362d0fa-c630-4dc4-ab85-c55fa5c3bb10',
          'image': 'redis:alpine',
          'networks': {
            'frontend': {
              'aliases': [],
              'id': '4c5c145a-576e-4236-9877-936abbe96332'
            }
          },
          'ports': [
            '6'
          ],
          'volumes': []
        },
        'result': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '0257474c-e29d-42ca-b674-ee11a6225daa',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '32294e8f-ef1c-448e-beef-b641d2640fc5',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '003c8ce3-6283-f8f3-a00f-9c29ee060d44',
                'position': {
                  'x': 142.5,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'db'
          ],
          'deploy': {
            'count': 1,
            'id': 'd66956e3-8d2a-4fb5-bbaa-b81b28d18237',
            'mode': 'replicated'
          },
          'id': 'c3f4bf2e-dfc4-4511-b025-ac747027c895',
          'image': 'dockersamples/examplevotingapp_result:before',
          'networks': {
            'backend': {
              'aliases': [],
              'id': 'b70ffd49-343d-4839-a278-49d12f7ee5a1'
            }
          },
          'ports': [
            '5001:80'
          ],
          'volumes': []
        },
        'visualizer': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '593c50a5-e43e-4103-96d2-0081d2f74010',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': 'dc4e9e1d-6606-400f-b187-0f2913809de4',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '1c8828ae-9ef1-e145-f8c1-9ce90fa1465c',
                'position': {
                  'x': 302.5,
                  'y': 100
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': 'bbcdb918-06c3-4fd0-9eb3-5289b21592e3',
            'mode': 'replicated'
          },
          'id': 'c47dcde4-1f0a-4786-965e-454b05d3b3b3',
          'image': 'dockersamples/visualizer:stable',
          'ports': [
            '8080:8080'
          ],
          'volumes': [
            '/var/run/docker.sock:/var/run/docker.sock'
          ]
        },
        'vote': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '1eef319d-8d72-44bb-ba34-c5cb15aecb76',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '03467c64-0ef2-4493-9852-1d421c5a9513',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'cfc82298-2f71-e06c-6b6d-702609cbc044',
                'position': {
                  'x': 452.5,
                  'y': 100
                }
              }
            }
          },
          'depends_on': [
            'redis'
          ],
          'deploy': {
            'count': 2,
            'id': '8a4fb74e-8638-44dc-aed7-d765ac25d16a',
            'mode': 'replicated'
          },
          'id': 'b8e700fe-47e4-4169-8e05-c9c8c9edf39f',
          'image': 'dockersamples/examplevotingapp_vote:before',
          'networks': {
            'frontend': {
              'aliases': [],
              'id': 'b0e63680-e30b-4b91-bd6c-774ae9a1123b'
            }
          },
          'ports': [
            '5000:80'
          ],
          'volumes': []
        },
        'worker': {
          'annotations': {
            'description': '[insert description of service here]',
            'development_config': {
              'id': '71818d2b-c85c-400e-8576-f35794e9f77e',
              'image': '',
              'repository': '',
              'tag': ''
            },
            'external_config': {
              'id': '246be462-b37e-459b-bf03-2b679a796cb1',
              'image': 'HAProxy',
              'proxy-type': 'HTTP',
              'server': ''
            },
            'override': 'none',
            'ui': {
              'canvas': {
                'id': 'dc349f1b-6487-0883-200e-da3a070d8b3d',
                'position': {
                  'x': 302.5,
                  'y': 250
                }
              }
            }
          },
          'deploy': {
            'count': 1,
            'id': '26d71303-3c35-4cba-9924-07352724bb49',
            'mode': 'replicated'
          },
          'id': '60e2a2bf-2709-4733-b521-8195587c3fac',
          'image': 'dockersamples/examplevotingapp_worker',
          'networks': {
            'backend': {
              'aliases': [],
              'id': 'f5b896a1-2c3e-49ce-978d-2201a4cc4f5c'
            },
            'frontend': {
              'aliases': [],
              'id': '04815d80-3eac-44ac-83d6-014faee175da'
            }
          },
          'volumes': []
        }
      },
      'volumes': {
        'db-data': {
          'annotations': {
            'description': '',
            'ui': {
              'canvas': {
                'id': 'e22a72f5-59b2-a536-481a-599289603b7f',
                'position': {
                  'x': 100,
                  'y': 400
                }
              }
            }
          },
          'id': '50c2df32-b1fa-4707-8f24-1f54f1529be6'
        }
      }
    }
  },
  {
    '_id': '444f2998-02d7-11e8-b7b8-9b271f823221',
    'author': 'jd3quist',
    'containers': [],
    'dateCreated': '2018-01-26T20:27:02.203771+00:00',
    'dateModified': '2018-01-26T20:27:02.203771+00:00',
    'downloads': 0,
    'fullname': 'jd3quist@github/e@no@ent/jd3quist/empty2.yipee',
    'hasLogo': false,
    'id': '444f2998-02d7-11e8-b7b8-9b271f823221',
    'isPrivate': true,
    'likes': 0,
    'logodata': null,
    'name': 'empty2',
    'orgname': 'jd3quist',
    'ownerorg': '812d420e-1558-11e7-a130-d3051574e881',
    'revcount': 1,
    'revnum': 1,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'description': '',
        'id': 'a64c5335-f4bd-4559-a3dd-fd3de772ef71',
        'logo': '',
        'name': 'empty2',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': [],
      'volumes': []
    },
    'username': 'jd3quist',
    'version': null,
    'vsncount': 0,
    'yipeeFile': {
      'app-info': {
        'description': '',
        'id': 'a64c5335-f4bd-4559-a3dd-fd3de772ef71',
        'logo': '',
        'name': 'empty2',
        'readme': '',
        'ui': {
          'canvas': {}
        }
      },
      'networks': {},
      'volumes': {}
    }
  }
];

const jerryRawData: YipeeFileMetadataRaw[] = [
  {
    '_id': '447f1cee-e6a2-11e7-8074-af76cca469b4',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'rws2',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':113,\'left\':78,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 2,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/rws2.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-12-21T22:57:06.633339+00:00',
    'dateModified': '2017-12-21T22:57:56.347188+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        },
        'Secret2': {
          'file': '',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        }
      },
      'volumes': {},
      'app-info': {
        'name': 'rws2',
        'readme': '',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'ports': [
            '80:80'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'target': 'SikhRhett'
            },
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret2',
              'target': 'TurbanButler'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': '447f1cee-e6a2-11e7-8074-af76cca469b4',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'rws2',
        'readme': '',
        'description': '',
        'id': '77dde925-71e4-4d39-b5d2-869a58c959fa'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'external': true,
          'id': '862576ea-b2fa-45fb-902f-9e086b934fd6',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': '2cccbc5b-99b3-4a7b-b785-70881e403172'
            }
          }
        },
        {
          'name': 'Secret2',
          'file': '',
          'id': '6bb7d274-0e0d-402d-b2ac-bfc5ca3c876d',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': 'eab285f8-52ce-4800-b9a6-3098e182c662'
            }
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'gid': '0',
              'id': '4e95d856-fa59-4de5-a1e4-de4edb9871f1',
              'target': 'SikhRhett'
            },
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret2',
              'gid': '0',
              'id': 'bbf29a62-7517-4e34-ab4c-99f1fc3730c5',
              'target': 'TurbanButler'
            }
          ],
          'name': 'racket',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '965fb949-dcf5-4d64-add5-025a26b57162'
            }
          ],
          'ports': [
            '80:80'
          ],
          'id': '7c88ae30-7612-4896-bcad-2a4a22aa65a3',
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'd6997766-8854-11e7-a847-cf3aef7e3cbf',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'wandaful',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'auth',
      'backend',
      'composecvt',
      'db',
      'kubecvt',
      'oscvt',
      'secret_scanner',
      'ui',
      'yipee_validator'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': null,
    'logodata': null,
    'revcount': 0,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/wandaful.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-08-23T22:46:01.707984+00:00',
    'dateModified': '2017-08-23T22:46:01.707984+00:00',
    'yipeeFile': {
      'secrets': {
        'dbpass': {
          'external': true,
          'annotations': {
            'description': '[insert description of secret here]',
            'externalenv': []
          }
        }
      },
      'volumes': {},
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'wandaful',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'db': {
          'image': 'postgres:9.5.5-alpine',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        'ui': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'ports': [
            '8080:80'
          ],
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'depends_on': [
            'backend'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        'auth': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'ports': [
            '8128:8128'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'db'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[3]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        'oscvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        },
        'backend': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'ports': [
            '5000:3000'
          ],
          'restart': 'always',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'CLIENT_SECRET',
                'reference': 'environment[7]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CLIENT_ID',
                'reference': 'environment[9]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[11]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        },
        'kubecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'ports': [
            '9091:9090'
          ],
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        },
        'composecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'ports': [
            '9090:9090'
          ],
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        },
        'secret_scanner': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        },
        'yipee_validator': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'ports': [
            '9099:9099'
          ],
          'restart': 'always',
          'networks': {
            'default': {}
          },
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        }
      }
    },
    'id': 'd6997766-8854-11e7-a847-cf3aef7e3cbf',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'wandaful',
        'description': '[insert app description here]',
        'id': '2debccaa-95e4-43cc-b3a7-fd24b8311aec'
      },
      'secrets': [
        {
          'name': 'dbpass',
          'external': true,
          'id': '4ae49495-1893-475f-b044-10b6fb3da9bb',
          'annotations': {
            'description': '[insert description of secret here]'
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'restart': 'always',
          'name': 'composecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'df0e8a2d-6bc0-4a53-b14a-e014548ec522'
            }
          ],
          'ports': [
            '9090:9090'
          ],
          'id': '1e3fe43a-0794-40b6-aca1-21eae030f32c',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'annotations': {
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'kubecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '8752fc66-4d71-4c77-98c5-58b7f5115171'
            }
          ],
          'ports': [
            '9091:9090'
          ],
          'id': '4cc4dc10-565f-4e38-8cc3-cb29ac969b0a',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'annotations': {
            'description': '[insert description of service here]'
          }
        },
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': '28fad3df-9091-48d6-83af-b17f9d95ee2e',
              'target': 'dbpass'
            }
          ],
          'name': 'auth',
          'depends_on': [
            'db'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '6793c516-df0e-48ea-be08-fcbb28dc301f'
            }
          ],
          'ports': [
            '8128:8128'
          ],
          'id': '0bd4b605-5517-4106-81e5-c5207691522b',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[3]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]'
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        {
          'restart': 'always',
          'name': 'ui',
          'depends_on': [
            'backend'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '9b67e353-a1b5-41a9-a45c-d14b985b8993'
            }
          ],
          'ports': [
            '8080:80'
          ],
          'id': '5df3738c-8dc5-4bfa-b768-eb96f99f0745',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'annotations': {
            'description': '[insert description of service here]'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        {
          'restart': 'always',
          'name': 'yipee_validator',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '95a3f89c-bb89-4c42-bde8-9d6bbadd2251'
            }
          ],
          'ports': [
            '9099:9099'
          ],
          'id': '5df53a7c-bab9-4e2f-b440-81d72fda2584',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'annotations': {
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'secret_scanner',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'da361655-7793-4b2a-9183-23a405472760'
            }
          ],
          'id': '654f855a-d367-4b21-b6ee-1246efb73be5',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'annotations': {
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'oscvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '26c94e39-10c1-4610-8984-408f065815a3'
            }
          ],
          'id': '2934bc63-702d-43c7-94cc-cee9218b46f4',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'annotations': {
            'description': '[insert description of service here]'
          }
        },
        {
          'name': 'db',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'f292c280-7ac3-4b35-8f2e-4c4adfa31759'
            }
          ],
          'id': '274472e7-eaa7-46b9-a86e-2590c706cbec',
          'image': 'postgres:9.5.5-alpine',
          'annotations': {
            'description': '[insert description of service here]'
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        {
          'restart': 'always',
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': '1e1e29e7-7461-46a6-b017-e51420b98c89',
              'target': 'dbpass'
            }
          ],
          'name': 'backend',
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '6ea0287d-a6f5-4d20-9fce-f33914a73bf2'
            }
          ],
          'ports': [
            '5000:3000'
          ],
          'id': 'f946b903-79e6-44e7-8bce-f6c7a4eeba9e',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[7]',
                'varname': 'CLIENT_SECRET'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[9]',
                'varname': 'CLIENT_ID'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[11]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]'
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        }
      ]
    }
  },
  {
    '_id': 'cbdf2122-371e-11e7-a36f-7bcb1b2b7a48',
    'repo': 'yipee-store',
    'branch': 'jrryjcksn@github|E@NO@ENT|jrryjcksn',
    'path': '/jrryjcksn@github/E@NO@ENT/jrryjcksn/rules.yipee',
    'name': 'rules',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'clojure'
    ],
    'sha': 'a4321181a3c283a63362e7937db108f852375cb7',
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'clojure\':{\'top\':120,\'left\':326,\'author\':\'DockerHub\',\'description\':\'Clojure is a dialect of Lisp that runs on the JVM.\',\'type\':\'default\',\'tagList\':[\'latest\',\'onbuild\',\'lein-onbuild\',\'lein-alpine-onbuild\',\'lein-alpine\',\'lein-2.7.1-onbuild\',\'lein-2.7.1-alpine-onbuild\',\'lein-2.7.1-alpine\',\'alpine-onbuild\',\'alpine\'],\'repo\':\'DockerHub\',\'tag\':\'alpine\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'volume_0\':{\'name\':\'volume_0\',\'top\':338.5,\'left\':503}}}',
    'logodata': null,
    'revcount': 6,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/rules.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-05-12T14:25:06.701777+00:00',
    'dateModified': '2017-08-02T21:24:48.398406+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'file': 'abone',
          'annotations': {
            'secret_config': {
              'file': 'abone'
            }
          }
        }
      },
      'volumes': {
        'volume_0': {
          'driver_opts': {
            '&gt;<img>': ''
          }
        }
      },
      'app-info': {
        'name': 'rules',
        'readme': '# Heading #\n## Yow! ##\nFoo',
        'description': ''
      },
      'networks': {},
      'services': {
        'clojure': {
          'image': 'clojure:alpine',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'target': 'abcd'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Clojure is a dialect of Lisp that runs on the JVM.'
          }
        }
      }
    },
    'id': 'cbdf2122-371e-11e7-a36f-7bcb1b2b7a48',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver_opts': [
            {
              'name': '&gt;<img>',
              'value': ''
            }
          ],
          'name': 'volume_0',
          'id': '392d75ce-e3f0-46e2-9b2e-f54566012710'
        }
      ],
      'appinfo': {
        'name': 'rules',
        'readme': '# Heading #\n## Yow! ##\nFoo',
        'description': '',
        'id': 'ac0543b5-f91b-4f61-950c-d589cf0ff7c4'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'file': 'abone',
          'id': '94cfe497-7d54-4dce-9c6a-8db365b116c1',
          'annotations': {
            'secret_config': {
              'file': 'abone',
              'id': '5b1655e2-e6fc-45c4-b779-6627b738a3f0'
            }
          }
        }
      ],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'gid': '0',
              'id': '33f27b33-8bd0-494a-ab45-d8f72001802a',
              'target': 'abcd'
            }
          ],
          'name': 'clojure',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '3c410dd7-2a8b-4393-9dfa-4428d84d24b1'
            }
          ],
          'id': 'dbd2e72b-58c1-4ec9-abbf-3d40f56f4079',
          'image': 'clojure:alpine',
          'annotations': {
            'description': 'Clojure is a dialect of Lisp that runs on the JVM.',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'e7511f6c-206e-11e7-aced-17f5e692c583',
    'repo': 'yipee-store',
    'branch': 'jrryjcksn@github|E@NO@ENT|jrryjcksn',
    'path': '/jrryjcksn@github/E@NO@ENT/jrryjcksn/racket.yipee',
    'name': 'racket',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': '84fff0fdfd90ac80df6c84f1ff4e66199b153da6',
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':113,\'left\':78,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 12,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/racket.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-04-13T17:30:35.742566+00:00',
    'dateModified': '2017-12-07T22:32:48.997931+00:00',
    'yipeeFile': {
      'secrets': {},
      'volumes': {},
      'app-info': {
        'name': 'racket',
        'readme': '',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'ports': [
            '80:80'
          ],
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': 'e7511f6c-206e-11e7-aced-17f5e692c583',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'racket',
        'readme': '',
        'description': '',
        'id': 'f570a320-7709-49a2-8948-b2bcde2679dd'
      },
      'volumes': [],
      'networks': [],
      'services': [
        {
          'name': 'racket',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '1a8527ab-6cee-40b2-8127-85c6cf51c7e1'
            }
          ],
          'ports': [
            '80:80'
          ],
          'id': 'aa7065d5-b9d4-47b5-902b-1fa251582eef',
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': '060e25d4-2386-11e7-9041-e372b0e1fb58',
    'repo': 'yipee-store',
    'branch': 'jrryjcksn@github|E@NO@ENT|jrryjcksn',
    'path': '/jrryjcksn@github/E@NO@ENT/jrryjcksn/xyz.yipee',
    'name': 'xyz',
    'author': 'Jerry R. Jackson',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': 'a8d8dd7c8294296514809ecb7458e01ac86db0d3',
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':205,\'left\':209,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'latest\',\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'revcount': 3,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/xyz.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-04-17T15:53:39.226238+00:00',
    'dateModified': '2017-06-27T20:04:49.527861+00:00',
    'yipeeFile': {
      'volumes': {},
      'app-info': {
        'logo': 'bob_subgenius.jpg',
        'name': 'xyz',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:latest',
          'command': '',
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'entrypoint': '',
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': '060e25d4-2386-11e7-9041-e372b0e1fb58',
    'hasLogo': true,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': 'bob_subgenius.jpg',
        'name': 'xyz',
        'description': '',
        'id': 'fbc56462-7fa7-4eb9-8f35-d33ab3decb95'
      },
      'volumes': [],
      'networks': [],
      'services': [
        {
          'name': 'racket',
          'command': '',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'fb44174e-a42a-4b66-8ec9-c06187cbb44c'
            }
          ],
          'id': '7ef1b44d-625f-4492-ad3e-c4abff18d274',
          'entrypoint': '',
          'image': 'jackfirth/racket:latest',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'f08002ee-2aad-11e7-a6cb-777358f79432',
    'repo': 'yipee-store',
    'branch': 'jrryjcksn@github|E@NO@ENT|jrryjcksn',
    'path': '/jrryjcksn@github/E@NO@ENT/jrryjcksn/crud.yipee',
    'name': 'crud',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'node'
    ],
    'sha': 'a4e98a767181d366b8e016625f04622960a58454',
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'node\':{\'top\':150,\'left\':230,\'author\':\'DockerHub\',\'description\':\'Node.js is a JavaScript-based platform for server-side and networking applications.\',\'type\':\'default\',\'tagList\':[\'latest\',\'4-wheezy\',\'4-slim\',\'4-onbuild\',\'4.8-wheezy\',\'4.8-slim\',\'4.8.3-wheezy\',\'4.8.3-slim\',\'argon-wheezy\',\'argon-slim\',\'argon-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 2,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/crud.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-04-26T18:27:01.071371+00:00',
    'dateModified': '2017-06-27T20:22:39.254259+00:00',
    'yipeeFile': {
      'volumes': {},
      'app-info': {
        'name': 'crud',
        'description': 'cause its node'
      },
      'networks': {},
      'services': {
        'node': {
          'image': 'node:latest',
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Node.js is a JavaScript-based platform for server-side and networking applications.'
          }
        }
      }
    },
    'id': 'f08002ee-2aad-11e7-a6cb-777358f79432',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'crud',
        'description': 'cause its node',
        'id': 'b13c9b98-dc17-49bc-8a4a-d48c324147f6'
      },
      'volumes': [],
      'networks': [],
      'services': [
        {
          'name': 'node',
          'id': '9f824949-e65a-4f29-a471-aa7c72289361',
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '3e09cbd6-3964-4361-b82d-ff057f01589a'
            }
          ],
          'image': 'node:latest',
          'volumes': [],
          'annotations': {
            'description': 'Node.js is a JavaScript-based platform for server-side and networking applications.',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'ff251148-7ed3-11e7-a4aa-6f1116a90917',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'yaia',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'auth',
      'backend',
      'composecvt',
      'db',
      'kubecvt',
      'oscvt',
      'secret_scanner',
      'ui',
      'yipee_validator'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'backend\':{\'top\':450,\'left\':500,\'description\':\'\',\'type\':\'default\',\'tag\':\'dbsecret\',\'typeConversionHistory\':{\'default\':true}},\'ui\':{\'top\':450,\'left\':250,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'composecvt\':{\'top\':253,\'left\':805,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'kubecvt\':{\'top\':450,\'left\':750,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipee_validator\':{\'top\':600,\'left\':500,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'db\':{\'top\':450,\'left\':0,\'description\':\'\',\'type\':\'default\',\'tag\':\'9.5.5-alpine\',\'typeConversionHistory\':{\'default\':true}},\'auth\':{\'top\':300,\'left\':0,\'description\':\'\',\'type\':\'default\',\'tag\':\'dbsecret\',\'typeConversionHistory\':{\'default\':true}},\'secret_scanner\':{\'top\':600,\'left\':250,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'oscvt\':{\'top\':150,\'left\':500,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 1,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/yaia.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-08-11T20:31:04.188579+00:00',
    'dateModified': '2017-08-11T20:32:01.08949+00:00',
    'yipeeFile': {
      'secrets': {
        'dbpass': {
          'external': true,
          'annotations': {
            'description': '[insert description of secret here]',
            'externalenv': [],
            'secret_config': {
              'file': ''
            }
          }
        }
      },
      'volumes': {},
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'yaia',
        'readme': '# Yet Another Imported Application',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'db': {
          'image': 'postgres:9.5.5-alpine',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        'ui': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'ports': [
            '8080:80'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'backend'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        'auth': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'ports': [
            '8128:8128'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'db'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[3]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        'oscvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'backend': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'ports': [
            '5000:3000'
          ],
          'restart': 'always',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[11]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CLIENT_SECRET',
                'reference': 'environment[7]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CLIENT_ID',
                'reference': 'environment[9]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        },
        'kubecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'ports': [
            '9091:9090'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'composecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'ports': [
            '9090:9090'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'secret_scanner': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipee_validator': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'ports': [
            '9099:9099'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        }
      }
    },
    'id': 'ff251148-7ed3-11e7-a4aa-6f1116a90917',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'yaia',
        'readme': '# Yet Another Imported Application',
        'description': '[insert app description here]',
        'id': 'e72c35ef-518d-43df-b858-a46691aa412c'
      },
      'secrets': [
        {
          'name': 'dbpass',
          'external': true,
          'id': '00628f6b-2502-4bde-aff8-d6e7228bead7',
          'annotations': {
            'description': '[insert description of secret here]',
            'secret_config': {
              'file': '',
              'id': 'e1c8dff8-c7c3-488c-b644-c12852bc3695'
            }
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': 'd81f50a3-b0f5-47ac-a5ae-0c7e5a772336',
              'target': 'dbpass'
            }
          ],
          'name': 'auth',
          'depends_on': [
            'db'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '2dc71965-89f1-4e65-90b5-a62085ed6b74'
            }
          ],
          'ports': [
            '8128:8128'
          ],
          'id': 'e43956b3-1a02-4a9d-9a9c-00df24946c2e',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[3]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        {
          'name': 'db',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'f7e8470c-5951-468a-9f49-eebc606396a4'
            }
          ],
          'id': '75ca5595-35bd-47d7-a9c4-33382f6379c6',
          'image': 'postgres:9.5.5-alpine',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        {
          'restart': 'always',
          'name': 'yipee_validator',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'a0cc57ce-41f7-48dc-a631-fa1c239326a2'
            }
          ],
          'ports': [
            '9099:9099'
          ],
          'id': '6972f036-8e03-4b14-95d3-bf425989030c',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'oscvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '8342aab1-9a8c-47ea-b138-c507f6bc45f5'
            }
          ],
          'id': '5d0e7e31-cc00-4311-94d0-11abe9afdb74',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'ui',
          'depends_on': [
            'backend'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '81443277-4501-4354-95eb-1dbba631af29'
            }
          ],
          'ports': [
            '8080:80'
          ],
          'id': 'edb53290-a5a9-4e60-9357-bdc8bc9e995a',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        {
          'restart': 'always',
          'name': 'secret_scanner',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '8bb68591-a237-43c4-aa72-8e5e55e3e328'
            }
          ],
          'id': 'e1cfc701-21f1-490f-b644-b6afaa351bf2',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'kubecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'e4ac0ffb-86b3-493d-be57-a18b67ee0abd'
            }
          ],
          'ports': [
            '9091:9090'
          ],
          'id': '35fee7a3-ea7a-4208-b8a2-f5fbbaa569a9',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': 'da68cf0f-8d2f-4327-a11c-08ab0edeaa01',
              'target': 'dbpass'
            }
          ],
          'name': 'backend',
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '7bf7b561-49ec-4cfe-9115-5b8ad66943f3'
            }
          ],
          'ports': [
            '5000:3000'
          ],
          'id': 'b244e4ee-616f-496c-bec3-2065920d78c8',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[9]',
                'varname': 'CLIENT_ID'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[11]',
                'varname': 'YIPEE_TEAM_OWNER'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[7]',
                'varname': 'CLIENT_SECRET'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        },
        {
          'restart': 'always',
          'name': 'composecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '23397052-6e41-44ac-b9e5-70907602a984'
            }
          ],
          'ports': [
            '9090:9090'
          ],
          'id': '5c35639f-2607-44b0-b19d-e4ea7093d054',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': '430b5c74-f0d4-11e7-84b7-137ccf4da3af',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'rws-and-volume',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':122,\'left\':323,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'vaalyume\':{\'name\':\'vaalyume\',\'top\':303.5,\'left\':644.5}}}',
    'logodata': null,
    'revcount': 11,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/rws-and-volume.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2018-01-03T22:20:10.660708+00:00',
    'dateModified': '2018-01-04T16:37:29.193853+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        }
      },
      'volumes': {
        'vaalyume': {
          'driver_opts': {}
        }
      },
      'app-info': {
        'name': 'rws-and-volume',
        'readme': '',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'ports': [
            '80:80'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'target': 'SikhRhett'
            }
          ],
          'volumes': [
            'vaalyume:/anbean'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': '430b5c74-f0d4-11e7-84b7-137ccf4da3af',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver_opts': [],
          'name': 'vaalyume',
          'id': 'b358a04e-8109-4dcb-85ff-3799a7555cc1'
        }
      ],
      'appinfo': {
        'name': 'rws-and-volume',
        'readme': '',
        'description': '',
        'id': '88ab20dc-185f-47a5-a358-b841bbee7b88'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'external': true,
          'id': 'b9652c30-ca26-4b21-b426-8a8d83587c8d',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': 'c24f1500-57cb-4186-b1c7-39b0cec47bc8'
            }
          }
        }
      ],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'gid': '0',
              'id': 'f2858a82-0177-4830-9006-d5befa6014e9',
              'target': 'SikhRhett'
            }
          ],
          'name': 'racket',
          'volumes': [
            'vaalyume:/anbean'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'a5198084-db23-4a5b-9556-204151b48e5e'
            }
          ],
          'ports': [
            '80:80'
          ],
          'id': '7d740c5d-e16b-4d4a-9041-2acb019f564a',
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': '7258570a-65ad-11e7-8a3c-6b20ccbc6d89',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'redisit',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'redis'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'redis\':{\'top\':184,\'left\':291,\'author\':\'DockerHub\',\'description\':\'Redis is an open source key-value store that functions as a data structure server.\',\'type\':\'default\',\'tagList\':[\'latest\',\'32bit\',\'3-alpine\',\'3-32bit\',\'3.2-alpine\',\'3.2-32bit\',\'3.2.9-alpine\',\'3.2.9-32bit\',\'3.0-alpine\',\'3.0.7-alpine\',\'alpine\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 1,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/redisit.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-07-10T20:22:08.020938+00:00',
    'dateModified': '2017-07-10T20:22:37.508206+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'file': 'abone'
        }
      },
      'volumes': {},
      'app-info': {
        'name': 'redisit',
        'description': ''
      },
      'networks': {},
      'services': {
        'redis': {
          'image': 'redis:latest',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'Secret1',
              'target': 'face'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Redis is an open source key-value store that functions as a data structure server.'
          }
        }
      }
    },
    'id': '7258570a-65ad-11e7-8a3c-6b20ccbc6d89',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'redisit',
        'description': '',
        'id': 'c36ed3c8-3951-4065-8c2b-ac8df08fdf14'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'file': 'abone',
          'id': '0431674b-5337-48b9-a38d-5ddc1af9bbd0'
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'Secret1',
              'gid': '0',
              'id': 'b0ce84f1-1c4d-46de-a1fc-f871f5c5b501',
              'target': 'face'
            }
          ],
          'name': 'redis',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '3732e5d9-5600-45b5-acae-2785ea46b344'
            }
          ],
          'id': 'fe6d74e8-7a72-4b63-90cc-7a2410ee4876',
          'image': 'redis:latest',
          'annotations': {
            'description': 'Redis is an open source key-value store that functions as a data structure server.',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'fec1d4c6-da03-11e7-9e8e-0f052da90746',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'aa',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'joomla',
      'mariadb'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'joomla\':{\'top\':450,\'left\':1000,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'mariadb\':{\'top\':450,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'10.1.26-r2\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'php_data\':{\'name\':\'php_data\',\'top\':600,\'left\':1058.3333333333333},\'apache_data\':{\'name\':\'apache_data\',\'top\':450,\'left\':1308.3333333333333},\'joomla_data\':{\'name\':\'joomla_data\',\'top\':300,\'left\':1058.3333333333333},\'mariadb_data\':{\'name\':\'mariadb_data\',\'top\':450,\'left\':558.3333333333334}}}',
    'logodata': null,
    'revcount': 4,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/aa.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-12-05T21:33:55.193581+00:00',
    'dateModified': '2017-12-05T21:52:37.969159+00:00',
    'yipeeFile': {
      'secrets': {},
      'volumes': {
        'php_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'apache_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'joomla_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'mariadb_data': {
          'driver': 'local',
          'driver_opts': {}
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'aa',
        'readme': '',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'joomla': {
          'image': 'bitnami/joomla:latest',
          'ports': [
            '443:443',
            '80:80'
          ],
          'secrets': [],
          'volumes': [
            'joomla_data:/bitnami/joomla',
            'apache_data:/bitnami/apache',
            'php_data:/bitnami/php'
          ],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'JOOMLA_PASSWORD',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        'mariadb': {
          'image': 'bitnami/mariadb:10.1.26-r2',
          'ports': [
            '3306:3306'
          ],
          'secrets': [],
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'MARIADB_PASSWORD',
                'reference': 'environment[2]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_DATABASE',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      }
    },
    'id': 'fec1d4c6-da03-11e7-9e8e-0f052da90746',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'apache_data',
          'id': 'a3394483-4fe0-4607-948c-a723ba152e84'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'joomla_data',
          'id': 'cc927e45-aeca-4c3e-ab39-8715746b61ed'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'mariadb_data',
          'id': '8d6707e2-9a42-4cc1-a37f-fbc745980114'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'php_data',
          'id': 'bd241ffc-cab2-45fd-8111-e56d5592f959'
        }
      ],
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'aa',
        'readme': '',
        'description': '[insert app description here]',
        'id': 'af87ae33-3ac1-47d6-ad73-9f81ff9cbd0f'
      },
      'networks': [],
      'services': [
        {
          'name': 'joomla',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            'apache_data:/bitnami/apache',
            'joomla_data:/bitnami/joomla',
            'php_data:/bitnami/php'
          ],
          'networks': [
            {
              'name': 'default',
              'id': 'd9a17a7f-0a96-4841-91ad-6ce2b129af79'
            }
          ],
          'ports': [
            '80:80',
            '443:443'
          ],
          'id': 'a53fd490-483d-4492-9e8b-69a6acd47dcb',
          'image': 'bitnami/joomla:latest',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'JOOMLA_PASSWORD'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        {
          'name': 'mariadb',
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': [
            {
              'name': 'default',
              'id': 'e745b853-8b56-4376-8c49-7fa675d71cee'
            }
          ],
          'ports': [
            '3306:3306'
          ],
          'id': '05e5a3cd-f7ca-43e9-8688-64012c27b935',
          'image': 'bitnami/mariadb:10.1.26-r2',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[2]',
                'varname': 'MARIADB_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'MARIADB_DATABASE'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      ]
    }
  },
  {
    '_id': 'bbce1492-f0d6-11e7-b70f-d70da64d999b',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'rws-and-volume2',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':113,\'left\':78,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'vaalyume\':{\'name\':\'vaalyume\',\'top\':436,\'left\':954.5}}}',
    'logodata': null,
    'revcount': 4,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/rws-and-volume2.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2018-01-03T22:37:52.257997+00:00',
    'dateModified': '2018-01-03T23:44:12.445853+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        },
        'Secret2': {
          'file': '',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        }
      },
      'volumes': {
        'vaalyume': {
          'driver_opts': {}
        }
      },
      'app-info': {
        'name': 'rws-and-volume2',
        'readme': '',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'ports': [
            '80:80'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'target': 'SikhRhett'
            },
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret2',
              'target': 'TurbanButler'
            }
          ],
          'volumes': [
            'vaalyume:/anbean'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': 'bbce1492-f0d6-11e7-b70f-d70da64d999b',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver_opts': [],
          'name': 'vaalyume',
          'id': '501478a8-d5e2-420e-bb23-814da6a395e8'
        }
      ],
      'appinfo': {
        'name': 'rws-and-volume2',
        'readme': '',
        'description': '',
        'id': '19500feb-7fba-4891-bf5c-9f9b0dfbaa88'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'external': true,
          'id': '1bae36b1-70c5-469b-807f-569562ee7f62',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': '60fca511-270d-48d6-aa17-c5f0575daf4f'
            }
          }
        },
        {
          'name': 'Secret2',
          'file': '',
          'id': '9b31c703-fd99-4acb-8a7c-0d6159571952',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': '4c9ddd2c-7566-42cc-b5f2-9e5d6917ab88'
            }
          }
        }
      ],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'gid': '0',
              'id': '5074fe2f-5c6b-4c47-83d6-b42d84270d0f',
              'target': 'SikhRhett'
            },
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret2',
              'gid': '0',
              'id': 'ad87fb36-d2fb-478d-9825-06eb1efb0a29',
              'target': 'TurbanButler'
            }
          ],
          'name': 'racket',
          'volumes': [
            'vaalyume:/anbean'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'eb8cb035-8211-495c-ab12-99220aaf7dd3'
            }
          ],
          'ports': [
            '80:80'
          ],
          'id': 'd12b6ce6-a0a2-4471-8a00-65646159efed',
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'd01f0a7c-5d20-11e7-bc6f-e77de9601848',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'myjoomla',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'joomla',
      'mariadb'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'joomla\':{\'top\':300,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'mariadb\':{\'top\':300,\'left\':250,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'php_data\':{\'name\':\'php_data\',\'top\':450,\'left\':558.3333333333334},\'apache_data\':{\'name\':\'apache_data\',\'top\':300,\'left\':808.3333333333334},\'joomla_data\':{\'name\':\'joomla_data\',\'top\':150,\'left\':558.3333333333334},\'mariadb_data\':{\'name\':\'mariadb_data\',\'top\':300,\'left\':58.333333333333336}}}',
    'logodata': null,
    'revcount': 0,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/myjoomla.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-06-29T23:15:17.009518+00:00',
    'dateModified': '2017-06-29T23:15:17.009518+00:00',
    'yipeeFile': {
      'volumes': {
        'php_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'apache_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'joomla_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'mariadb_data': {
          'driver': 'local',
          'driver_opts': {}
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'myjoomla',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'joomla': {
          'image': 'bitnami/joomla:latest',
          'ports': [
            '443:443',
            '80:80'
          ],
          'volumes': [
            'joomla_data:/bitnami/joomla',
            'apache_data:/bitnami/apache',
            'php_data:/bitnami/php'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'MARIADB_HOST=mariadb',
            'MARIADB_PORT=3306',
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        },
        'mariadb': {
          'image': 'bitnami/mariadb:latest',
          'ports': [
            '3306:3306'
          ],
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_DATABASE=${MARIADB_DATABASE}'
          ]
        }
      }
    },
    'id': 'd01f0a7c-5d20-11e7-bc6f-e77de9601848',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'php_data',
          'id': '4eb5ef2e-5292-46c8-9153-e18237362c38'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'apache_data',
          'id': 'e3b74bdb-24bb-41cb-8cbd-5fbc00fcf829'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'joomla_data',
          'id': 'a70b3fd6-88e4-4739-9beb-7ac547211d5f'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'mariadb_data',
          'id': '91f2328e-9548-48c7-a473-3640a853079e'
        }
      ],
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'myjoomla',
        'description': '[insert app description here]',
        'id': '886535ee-4a13-4ac9-bff3-3677c6ca73c6'
      },
      'networks': [],
      'services': [
        {
          'name': 'joomla',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            'apache_data:/bitnami/apache',
            'joomla_data:/bitnami/joomla',
            'php_data:/bitnami/php'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '1dd56ddb-7f35-4eb2-8a5d-9a815c6437b3'
            }
          ],
          'ports': [
            '443:443',
            '80:80'
          ],
          'id': '67db7b99-b7b3-4882-aeca-ed1f25639e89',
          'image': 'bitnami/joomla:latest',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        {
          'name': 'mariadb',
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'b89a9b9e-0185-48eb-949c-c5bd16d95d10'
            }
          ],
          'ports': [
            '3306:3306'
          ],
          'id': 'd8b1dbec-d77b-409b-8357-43a68f0e94cc',
          'image': 'bitnami/mariadb:latest',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      ]
    }
  },
  {
    '_id': '0c4e8558-206e-11e7-9814-177ec2d6e906',
    'repo': 'yipee-store',
    'branch': 'jrryjcksn@github|E@NO@ENT|jrryjcksn',
    'path': '/jrryjcksn@github/E@NO@ENT/jrryjcksn/moreinteresting.yipee',
    'name': 'moreinteresting',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': '85a4c6b34148924c595cbfffba4260b2798f7923',
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':138,\'left\':100,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'latest\',\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 3,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/moreinteresting.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-04-13T17:24:28.304639+00:00',
    'dateModified': '2017-06-27T20:07:22.491074+00:00',
    'yipeeFile': {
      'volumes': {},
      'app-info': {
        'name': 'moreinteresting',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': '0c4e8558-206e-11e7-9814-177ec2d6e906',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'moreinteresting',
        'description': '',
        'id': 'f688ac3d-ded4-4190-b58c-57899f9ade6e'
      },
      'volumes': [],
      'networks': [],
      'services': [
        {
          'name': 'racket',
          'id': 'ee2c2908-8805-4aca-a105-5b30faffcbfc',
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '71c68d6d-0ec8-4a6a-967d-7243e8a32d20'
            }
          ],
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'volumes': [],
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'ad200de2-8dad-11e7-9964-ff37597f6fe6',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'testsecrets',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'grafana',
      'influxdb',
      'telegraf'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'influxdb\':{\'top\':450,\'left\':500,\'description\':\'\',\'type\':\'default\',\'tag\':\'1.1.4-alpine\',\'typeConversionHistory\':{\'default\':true}},\'grafana\':{\'top\':450,\'left\':250,\'description\':\'\',\'type\':\'default\',\'tag\':\'4.1.2\',\'typeConversionHistory\':{\'default\':true}},\'telegraf\':{\'top\':300,\'left\':500,\'description\':\'\',\'type\':\'default\',\'tag\':\'1.2\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 1,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/testsecrets.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-08-30T18:04:33.148204+00:00',
    'dateModified': '2017-08-30T18:05:28.515216+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': ''
            }
          }
        },
        'monitor_secret': {
          'external': {
            'name': '${MONITOR_SECRET}'
          },
          'annotations': {
            'description': '[insert description of secret here]',
            'externalenv': [],
            'secret_config': {
              'file': ''
            }
          }
        }
      },
      'volumes': {},
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'testsecrets',
        'readme': '',
        'description': '[insert appxxx description here]'
      },
      'networks': {},
      'services': {
        'grafana': {
          'image': 'grafana/grafana:4.1.2',
          'ports': [
            'map[target:3000 mode:ingress protocol:tcp published:9000]'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'secrets': [],
          'volumes': [
            '/grafana/data:'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'influxdb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'GF_INSTALL_PLUGINS=raintank-worldping-app,grafana-piechart-panel',
            'GF_PATHS_DATA=/grafana/data',
            'GF_SERVER_DOMAIN=monitor.myrides.com',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ]
        },
        'influxdb': {
          'image': 'influxdb:1.1.4-alpine',
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'secrets': [],
          'volumes': [
            '/var/lib/influxdb:'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'INFLUXDB_DATA_QUERY_LOG=false'
          ]
        },
        'telegraf': {
          'image': 'myapp/telegraf:1.2',
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'monitor_secret',
              'target': 'monitor_secret'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'influxdb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        }
      }
    },
    'id': 'ad200de2-8dad-11e7-9964-ff37597f6fe6',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'testsecrets',
        'readme': '',
        'description': '[insert appxxx description here]',
        'id': '10c8b2ee-fbf3-4116-84de-70ce34f44f2e'
      },
      'secrets': [
        {
          'name': 'monitor_secret',
          'external': {
            'name': '${MONITOR_SECRET}'
          },
          'id': '9b95eb0c-0fdf-424b-becd-8583cdaf100f',
          'annotations': {
            'secret_config': {
              'file': '',
              'id': 'bca739db-5718-45d5-823a-8587aeff74fa'
            },
            'description': '[insert description of secret here]'
          }
        },
        {
          'name': 'Secret1',
          'external': true,
          'id': '1825b4e0-5dbe-4a16-9a9c-f769d7cb053e',
          'annotations': {
            'secret_config': {
              'file': '',
              'id': 'cb451f00-a2bc-4e06-9dee-d472a2b2386f'
            }
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'monitor_secret',
              'gid': '0',
              'id': '71b78dbd-f4b1-4210-987c-6b728e0ea4dc',
              'target': 'monitor_secret'
            }
          ],
          'name': 'telegraf',
          'depends_on': [
            'influxdb'
          ],
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '317ca9cd-9d87-403d-a64a-c8fac229fc12'
            }
          ],
          'id': '97f3a584-a28c-4ef0-9d43-a7272317383a',
          'image': 'myapp/telegraf:1.2',
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': '417c5f43-4333-4742-bdb2-284d4cfcbd3e'
          }
        },
        {
          'name': 'grafana',
          'depends_on': [
            'influxdb'
          ],
          'volumes': [
            '/grafana/data:'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'ed8c9914-d6b0-431d-a140-a3f5c6ca7971'
            }
          ],
          'ports': [
            'map[target:3000 mode:ingress protocol:tcp published:9000]'
          ],
          'id': '61062af4-583c-444d-aa7a-242c6468b7f1',
          'image': 'grafana/grafana:4.1.2',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'GF_INSTALL_PLUGINS=raintank-worldping-app,grafana-piechart-panel',
            'GF_PATHS_DATA=/grafana/data',
            'GF_SERVER_DOMAIN=monitor.myrides.com',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': '0f073ed1-88b4-4586-96bd-d652469aeade'
          }
        },
        {
          'name': 'influxdb',
          'volumes': [
            '/var/lib/influxdb:'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'c7f3b1c9-2cec-4968-af25-49e422d039be'
            }
          ],
          'id': '718f02ff-a7b5-4e47-b1a7-52202d6c155b',
          'image': 'influxdb:1.1.4-alpine',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'INFLUXDB_DATA_QUERY_LOG=false'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': '32f22f2e-cc8d-4d99-a1bc-d8d299cc5f3e'
          }
        }
      ]
    }
  },
  {
    '_id': '6b725a54-e739-11e7-9999-43e9caebf180',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'goombah',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'grafana',
      'influxdb',
      'telegraf'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': null,
    'logodata': null,
    'revcount': 0,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/goombah.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-12-22T16:59:05.985735+00:00',
    'dateModified': '2017-12-22T16:59:05.985735+00:00',
    'yipeeFile': {
      'secrets': {
        'monitor_secret': {
          'external': {
            'name': '${MONITOR_SECRET}'
          },
          'annotations': {
            'description': '[insert description of secret here]',
            'externalenv': []
          }
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'goombah',
        'description': '[insert app description here]'
      },
      'services': {
        'grafana': {
          'image': 'grafana/grafana:4.1.2',
          'ports': [
            'map[mode:ingress protocol:tcp published:9000 target:3000]'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'volumes': [
            '/grafana/data'
          ],
          'depends_on': [
            'influxdb'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          },
          'environment': [
            'GF_INSTALL_PLUGINS=raintank-worldping-app,grafana-piechart-panel',
            'GF_PATHS_DATA=/grafana/data',
            'GF_SERVER_DOMAIN=monitor.myrides.com',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ]
        },
        'influxdb': {
          'image': 'influxdb:1.1.4-alpine',
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'volumes': [
            '/var/lib/influxdb'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          },
          'environment': [
            'INFLUXDB_DATA_QUERY_LOG=false'
          ]
        },
        'telegraf': {
          'image': 'myapp/telegraf:1.2',
          'deploy': {
            'mode': 'replicated',
            'count': 1
          },
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'monitor_secret',
              'target': 'monitor_secret'
            }
          ],
          'depends_on': [
            'influxdb'
          ],
          'annotations': {
            'description': '[insert description of service here]',
            'externalenv': []
          }
        }
      }
    },
    'id': '6b725a54-e739-11e7-9999-43e9caebf180',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'goombah',
        'description': '[insert app description here]',
        'id': 'e9737e40-54f1-480d-9b7f-62440ffe1527'
      },
      'secrets': [
        {
          'name': 'monitor_secret',
          'external': {
            'name': '${MONITOR_SECRET}'
          },
          'id': 'df5b0adf-9800-484a-9ca8-ef791f2acbce',
          'annotations': {
            'description': '[insert description of secret here]'
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'name': 'grafana',
          'depends_on': [
            'influxdb'
          ],
          'volumes': [
            '/grafana/data'
          ],
          'ports': [
            'map[mode:ingress protocol:tcp published:9000 target:3000]'
          ],
          'id': '18499b66-8306-4d9d-855a-2e2a1b26f7ce',
          'image': 'grafana/grafana:4.1.2',
          'annotations': {
            'description': '[insert description of service here]'
          },
          'environment': [
            'GF_INSTALL_PLUGINS=raintank-worldping-app,grafana-piechart-panel',
            'GF_PATHS_DATA=/grafana/data',
            'GF_SERVER_DOMAIN=monitor.myrides.com',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': 'd0140f86-2989-4754-8e3b-32c2763b7c75'
          }
        },
        {
          'name': 'influxdb',
          'volumes': [
            '/var/lib/influxdb'
          ],
          'id': '7197634e-ce56-44f8-b6ca-291260b2e44a',
          'image': 'influxdb:1.1.4-alpine',
          'annotations': {
            'description': '[insert description of service here]'
          },
          'environment': [
            'INFLUXDB_DATA_QUERY_LOG=false'
          ],
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': 'ca33b744-50f6-4cfb-ab8f-51b4a4a58756'
          }
        },
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'monitor_secret',
              'gid': '0',
              'id': '768165fe-e70d-4ca2-b8cf-3b1945e099a4',
              'target': 'monitor_secret'
            }
          ],
          'name': 'telegraf',
          'depends_on': [
            'influxdb'
          ],
          'volumes': [],
          'id': 'f7d92124-ed49-489a-ab8d-fdbcc0d2ce54',
          'hold_for_compose': {
            'deploy': {
              'placement': {
                'constraints': [
                  'node.role == worker'
                ]
              },
              'mode': 'replicated'
            }
          },
          'image': 'myapp/telegraf:1.2',
          'annotations': {
            'description': '[insert description of service here]'
          },
          'deploy': {
            'mode': 'replicated',
            'count': 1,
            'id': '7baef831-127e-4587-88ad-4a1484c4d35b'
          }
        }
      ]
    }
  },
  {
    '_id': 'f198f5e2-973a-11e7-bef8-4b9bbc1a61c0',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'MyGrafana',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'adminer',
      'grafana',
      'mariadb'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'adminer\':{\'top\':124,\'left\':615,\'author\':\'DockerHub\',\'description\':\'Database management in a single PHP file.\',\'type\':\'default\',\'tagList\':[\'latest\',\'4\',\'4-standalone\',\'4-fastcgi\',\'4.3\',\'4.3-fastcgi\',\'4.3.1\',\'4.3.1-fastcgi\',\'standalone\',\'fastcgi\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'grafana\':{\'top\':128,\'left\':131,\'author\':\'grafana\',\'description\':\'The official Grafana docker container\',\'type\':\'default\',\'tagList\':[\'latest\',\'4.4.3\',\'4.4.2\',\'4.4.1\',\'4.4.0\',\'4.3.2\',\'4.3.1\',\'4.3.0\',\'4.3.0-beta1\',\'master\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'mariadb\':{\'top\':302,\'left\':395,\'author\':\'DockerHub\',\'description\':\'MariaDB is a community-developed fork of MySQL intended to remain free under the GNU GPL.\',\'type\':\'default\',\'tagList\':[\'latest\',\'5\',\'5.5\',\'5.5.57\',\'10.3\',\'10.3.1\',\'10.1\',\'10.1.26\',\'10.0\',\'10.0.32\'],\'repo\':\'DockerHub\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'dbstorage\':{\'name\':\'dbstorage\',\'top\':438,\'left\':473.5},\'grafanastorage\':{\'name\':\'grafanastorage\',\'top\':269,\'left\':120.5}}}',
    'logodata': null,
    'revcount': 6,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/mygrafana.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-09-11T21:48:27.529286+00:00',
    'dateModified': '2017-09-11T21:59:42.470706+00:00',
    'yipeeFile': {
      'secrets': {
        'dbroot': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': ''
            }
          }
        }
      },
      'volumes': {
        'dbstorage': {
          'driver_opts': {}
        },
        'grafanastorage': {
          'driver_opts': {}
        }
      },
      'app-info': {
        'name': 'MyGrafana',
        'readme': '# General \nAdd a secret for the db ```echo yourpass | docker secret create dbroot -```\n\n# Grafana\nAvailable at http://localhost:3000\n\nDefault user: admin\nDefault pass: admin\n\nsetup data source for db \n   host : db:3306\n   user: tsuser\n   pass: tsuser (needs to match the db)\n\n# Adminer (previously know as phpMinAdmin)\nAvailable at http://localhost:8080\n\n# Mariadb\n1. connect to the adminer process ```localhost:8080``` user is root and password is what you put in the secret.\n1. create db ```tsdata```\n1. choose the _tsdata_ dabase\n1. create user ```tsuser``` password ```tsuser``` (or what you plan to use in grafana) \n1. give select permissions to _tsuser_ on table and column\n1. create table(s) to use by following grafana requirements.\n```\ncreate table grafana_data (timestamp timestamp, value double, metric varchar(20));\n```',
        'description': ''
      },
      'networks': {},
      'services': {
        'adminer': {
          'image': 'adminer:latest',
          'ports': [
            '8080:8080'
          ],
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': 'Database management in a single PHP file.'
          }
        },
        'grafana': {
          'image': 'grafana/grafana:latest',
          'ports': [
            '3000:3000'
          ],
          'secrets': [],
          'volumes': [
            'grafanastorage:/var/lib/grafana'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': 'The official Grafana docker container'
          }
        },
        'mariadb': {
          'image': 'mariadb:latest',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'dbroot',
              'target': 'dbpass'
            }
          ],
          'volumes': [
            'dbstorage:/var/lib/mysql'
          ],
          'networks': {
            'default': {
              'aliases': [
                'db'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'MariaDB is a community-developed fork of MySQL intended to remain free under the GNU GPL.'
          },
          'environment': [
            'MYSQL_ROOT_PASSWORD_FILE=/mnt/run/secrets/dbpass'
          ]
        }
      }
    },
    'id': 'f198f5e2-973a-11e7-bef8-4b9bbc1a61c0',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver_opts': [],
          'name': 'dbstorage',
          'id': 'feebb54b-6422-472c-8026-2e1ad2867c94'
        },
        {
          'driver_opts': [],
          'name': 'grafanastorage',
          'id': 'd666a098-dc74-491f-9152-13d899327b97'
        }
      ],
      'appinfo': {
        'name': 'MyGrafana',
        'readme': '# General \nAdd a secret for the db ```echo yourpass | docker secret create dbroot -```\n\n# Grafana\nAvailable at http://localhost:3000\n\nDefault user: admin\nDefault pass: admin\n\nsetup data source for db \n   host : db:3306\n   user: tsuser\n   pass: tsuser (needs to match the db)\n\n# Adminer (previously know as phpMinAdmin)\nAvailable at http://localhost:8080\n\n# Mariadb\n1. connect to the adminer process ```localhost:8080``` user is root and password is what you put in the secret.\n1. create db ```tsdata```\n1. choose the _tsdata_ dabase\n1. create user ```tsuser``` password ```tsuser``` (or what you plan to use in grafana) \n1. give select permissions to _tsuser_ on table and column\n1. create table(s) to use by following grafana requirements.\n```\ncreate table grafana_data (timestamp timestamp, value double, metric varchar(20));\n```',
        'description': '',
        'id': 'c620df0f-7825-47ce-9a56-92e6d7352c38'
      },
      'secrets': [
        {
          'name': 'dbroot',
          'external': true,
          'id': 'c55dd1ea-8599-4ee0-9f9a-35989e67cef1',
          'annotations': {
            'secret_config': {
              'file': '',
              'id': '7e589fe8-dcc3-441f-96f0-0d04bd718b24'
            }
          }
        }
      ],
      'networks': [],
      'services': [
        {
          'name': 'adminer',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'bcf548dd-bea2-4f3f-93af-483d4217b9c0'
            }
          ],
          'ports': [
            '8080:8080'
          ],
          'id': 'abbe931b-d2c0-46f3-b4e9-27e5d8489046',
          'image': 'adminer:latest',
          'annotations': {
            'description': 'Database management in a single PHP file.',
            'override': 'none'
          }
        },
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'dbroot',
              'gid': '0',
              'id': '1dbc75c0-bfed-42c3-9ad3-540452b8ca73',
              'target': 'dbpass'
            }
          ],
          'name': 'mariadb',
          'volumes': [
            'dbstorage:/var/lib/mysql'
          ],
          'networks': [
            {
              'aliases': [
                'db'
              ],
              'name': 'default',
              'id': '08939428-eae1-4c02-bb1a-c5ca584a856b'
            }
          ],
          'id': 'ecfce005-6dbc-4336-aed5-2af89d762566',
          'image': 'mariadb:latest',
          'annotations': {
            'description': 'MariaDB is a community-developed fork of MySQL intended to remain free under the GNU GPL.',
            'override': 'none'
          },
          'environment': [
            'MYSQL_ROOT_PASSWORD_FILE=/mnt/run/secrets/dbpass'
          ]
        },
        {
          'name': 'grafana',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            'grafanastorage:/var/lib/grafana'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '79645483-2d5d-44d9-a2a7-e929703ba2b2'
            }
          ],
          'ports': [
            '3000:3000'
          ],
          'id': '4538acc3-23b7-444d-90fc-3634c8a7b9ff',
          'image': 'grafana/grafana:latest',
          'annotations': {
            'description': 'The official Grafana docker container',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': 'be8b138c-8854-11e7-930d-8bb3bb22e746',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'tester',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'auth',
      'backend',
      'composecvt',
      'db',
      'kubecvt',
      'oscvt',
      'secret_scanner',
      'ui',
      'yipee_validator'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'backend\':{\'top\':450,\'left\':750,\'description\':\'\',\'type\':\'default\',\'tag\':\'dbsecret\',\'typeConversionHistory\':{\'default\':true}},\'ui\':{\'top\':450,\'left\':500,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'composecvt\':{\'top\':300,\'left\':750,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'kubecvt\':{\'top\':450,\'left\':1000,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipee_validator\':{\'top\':600,\'left\':750,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'db\':{\'top\':450,\'left\':250,\'description\':\'\',\'type\':\'default\',\'tag\':\'9.5.5-alpine\',\'typeConversionHistory\':{\'default\':true}},\'auth\':{\'top\':450,\'left\':0,\'description\':\'\',\'type\':\'default\',\'tag\':\'dbsecret\',\'typeConversionHistory\':{\'default\':true}},\'secret_scanner\':{\'top\':600,\'left\':500,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'oscvt\':{\'top\':150,\'left\':750,\'description\':\'\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 1,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/tester.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-08-23T22:45:21.348253+00:00',
    'dateModified': '2017-10-19T15:40:26.474961+00:00',
    'yipeeFile': {
      'secrets': {
        'dbpass': {
          'external': true,
          'annotations': {
            'description': '[insert description of secret here]',
            'externalenv': [],
            'secret_config': {
              'externalName': 'true'
            }
          }
        }
      },
      'volumes': {},
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'tester',
        'readme': '',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'db': {
          'image': 'postgres:9.5.5-alpine',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        'ui': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'ports': [
            '8080:80'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'backend'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        'auth': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'ports': [
            '8128:8128'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'db'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[3]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        'oscvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'backend': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'ports': [
            '5000:3000'
          ],
          'restart': 'always',
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'target': 'dbpass'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'CLIENT_SECRET',
                'reference': 'environment[7]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[11]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CLIENT_ID',
                'reference': 'environment[9]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        },
        'kubecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'ports': [
            '9091:9090'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'composecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'ports': [
            '9090:9090'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'secret_scanner': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipee_validator': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'ports': [
            '9099:9099'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        }
      }
    },
    'id': 'be8b138c-8854-11e7-930d-8bb3bb22e746',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'tester',
        'readme': '',
        'description': '[insert app description here]',
        'id': '280f2e4c-040f-4e5b-90b2-144bd6414218'
      },
      'secrets': [
        {
          'name': 'dbpass',
          'external': true,
          'id': '6d150a1e-896c-4d80-aa07-8e28a985447c',
          'annotations': {
            'description': '[insert description of secret here]',
            'secret_config': {
              'externalName': 'true',
              'id': 'ae94232f-e1ec-434a-8345-8e378a31626d'
            }
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': '1ac072f0-442d-41c8-b4a4-b59cbbc61a4f',
              'target': 'dbpass'
            }
          ],
          'name': 'auth',
          'depends_on': [
            'db'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '5e252ef7-4964-446e-9eff-71a993b5dc45'
            }
          ],
          'ports': [
            '8128:8128'
          ],
          'id': '4b64d992-6300-495d-9bd5-c6ced14fcdf3',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/auth:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[3]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_PASSWD=glorpsnoggle',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        {
          'name': 'db',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '2571a8e2-32d0-4344-9286-a19123dc348e'
            }
          ],
          'id': '416c751a-1a12-45bd-b0c6-a6f28f4b6832',
          'image': 'postgres:9.5.5-alpine',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'POSTGRES_PASSWORD=gloombacon'
          ]
        },
        {
          'restart': 'always',
          'name': 'yipee_validator',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'c00c601d-e692-43bf-8283-cb8fe6c33016'
            }
          ],
          'ports': [
            '9099:9099'
          ],
          'id': 'a692fcc7-735f-47f5-9766-8957728afe2d',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'oscvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'b53249f3-a3e9-415e-a298-4aa7445208db'
            }
          ],
          'id': '4fc248b8-cb0a-48d9-8865-9b0ca4c7c054',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'ui',
          'depends_on': [
            'backend'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'dae87ca8-e893-4dbc-b359-09e1d2e5f4d8'
            }
          ],
          'ports': [
            '8080:80'
          ],
          'id': 'b7a79350-865e-4435-8792-276fffd151c5',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/zebra',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=cos.yipee.io|github-isl-01.ca.com'
          ]
        },
        {
          'restart': 'always',
          'name': 'secret_scanner',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '262fac09-1952-45b3-adf0-44887bdbaad6'
            }
          ],
          'id': 'b821f512-9152-4778-9be2-590050f5e1df',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'kubecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'fd21a274-8dcf-4798-972a-fc9fb5de262c'
            }
          ],
          'ports': [
            '9091:9090'
          ],
          'id': '4895e9f7-584c-4c7a-8ea5-a9c24288f1d4',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'secrets': [
            {
              'uid': '0',
              'mode': '666',
              'source': 'dbpass',
              'gid': '0',
              'id': 'ccdf80ab-90d1-4e5e-a609-cf2045929a8f',
              'target': 'dbpass'
            }
          ],
          'name': 'backend',
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '324d78e3-5937-4639-8316-563b986d9044'
            }
          ],
          'ports': [
            '5000:3000'
          ],
          'id': 'eabf3c6d-4314-4b22-8cd3-ace4d251e0ec',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:dbsecret',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[9]',
                'varname': 'CLIENT_ID'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[7]',
                'varname': 'CLIENT_SECRET'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[11]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'CALLBACK_HOST=localhost',
            'CLIENT_ID=${CLIENT_ID}',
            'CLIENT_SECRET=${CLIENT_SECRET}',
            'CONTAINER_URL=http://composecvt:9090',
            'DOKKEN_URL=http://backend:3000',
            'GITHUB_HOST=github-isl-01.ca.com',
            'KUBERNETES_URL=http://kubecvt:9090',
            'LOG_LEVEL=info',
            'OPENSHIFT_URL=http://oscvt:9090',
            'PG_HOST=db',
            'PG_PORT=5432',
            'PG_PW=glorpsnoggle',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}',
            'YIPEE_VALIDATOR_URL=http://yipee_validator:9099'
          ]
        },
        {
          'restart': 'always',
          'name': 'composecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'eed73500-32c5-476e-a5fc-d8365951087f'
            }
          ],
          'ports': [
            '9090:9090'
          ],
          'id': '7f7141d6-928f-49d1-b9d5-b6f15b1fd1ae',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': '4b8f5de2-ce14-11e7-991b-839ff17ec0ff',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'urg',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'auth',
      'backend',
      'composecvt',
      'db',
      'kubecvt',
      'oscvt',
      'secret_scanner',
      'ui',
      'uicvt',
      'yipee_validator',
      'yipeemon_caddy',
      'yipeemon_cadvisor',
      'yipeemon_grafana',
      'yipeemon_nodeexporter',
      'yipeemon_prometheus'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'db\':{\'top\':600,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'9.5.5-alpine\',\'typeConversionHistory\':{\'default\':true}},\'ui\':{\'top\':450,\'left\':1000,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'auth\':{\'top\':600,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'oscvt\':{\'top\':600,\'left\':250,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'uicvt\':{\'top\':150,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'backend\':{\'top\':450,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'uifmt\',\'typeConversionHistory\':{\'default\':true}},\'kubecvt\':{\'top\':300,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'composecvt\':{\'top\':450,\'left\':250,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'secret_scanner\':{\'top\':300,\'left\':250,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipeemon_caddy\':{\'top\':600,\'left\':1000,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipee_validator\':{\'top\':450,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipeemon_grafana\':{\'top\':300,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipeemon_cadvisor\':{\'top\':750,\'left\':1000,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'v0.27.1\',\'typeConversionHistory\':{\'default\':true}},\'yipeemon_prometheus\':{\'top\':300,\'left\':1000,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'typeConversionHistory\':{\'default\':true}},\'yipeemon_nodeexporter\':{\'top\':750,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'v0.15.0\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'yipeemon_grafana_data\':{\'name\':\'yipeemon_grafana_data\',\'top\':150,\'left\':808.3333333333334},\'yipeemon_prometheus_data\':{\'name\':\'yipeemon_prometheus_data\',\'top\':150,\'left\':1058.3333333333333}}}',
    'logodata': null,
    'revcount': 3,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/urg.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-11-20T17:00:22.041688+00:00',
    'dateModified': '2017-11-20T17:02:14.013351+00:00',
    'yipeeFile': {
      'secrets': {},
      'volumes': {
        'yipeemon_grafana_data': {
          'driver_opts': {}
        },
        'yipeemon_prometheus_data': {
          'driver_opts': {}
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'urg',
        'readme': '',
        'description': '[insert app description here]'
      },
      'networks': {
        'yipee-monitoring-net': null
      },
      'services': {
        'db': {
          'image': 'postgres:9.5.5-alpine',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'ui': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/korn',
          'ports': [
            '8443:443',
            '8080:80'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=app.yipee.io|github.com'
          ]
        },
        'auth': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-auth',
          'ports': [
            '8128:8128'
          ],
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'db'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'POSTGRES_DB=postgres',
            'POSTGRES_HOST=db',
            'POSTGRES_SSL=disable',
            'POSTGRES_USER=postgres',
            'YIPEE_TEAM_OWNER=${YIPEE_TEAM_OWNER}'
          ]
        },
        'oscvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'uicvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/uicvt',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'backend': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:uifmt',
          'ports': [
            '5000:3000'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner',
            'oscvt',
            'uicvt'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'CLIENT_SECRET',
                'reference': 'environment[2]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'YIPEE_TEAM_OWNER',
                'reference': 'environment[11]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CLIENT_ID',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'CALLBACK_HOST',
                'reference': 'environment[0]',
                'description': '[insert description of environment variable here]'
              }
            ]
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
        'kubecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'composecvt': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'secret_scanner': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipeemon_caddy': {
          'image': 'yipeeio/caddy',
          'ports': [
            '3000:3000',
            '9090:9090'
          ],
          'deploy': {
            'mode': 'allnodes'
          },
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'secrets': [],
          'volumes': [],
          'networks': {
            'yipee-monitoring-net': {
              'aliases': [
                'caddy'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}',
            'ADMIN_USER=${ADMIN_USER:-admin}'
          ]
        },
        'yipee_validator': {
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'ports': [
            '9099:9099'
          ],
          'restart': 'always',
          'secrets': [],
          'volumes': [],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipeemon_grafana': {
          'image': 'yipeeio/grafana',
          'deploy': {
            'mode': 'allnodes'
          },
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'secrets': [],
          'volumes': [
            ':/var/lib/grafana'
          ],
          'networks': {
            'yipee-monitoring-net': {
              'aliases': [
                'grafana'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          },
          'environment': [
            'GF_DASHBOARDS_JSON_ENABLED=true',
            'GF_DASHBOARDS_JSON_PATH=/dashboards',
            'GF_SECURITY_ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}',
            'GF_SECURITY_ADMIN_USER=${ADMIN_USER:-admin}',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ]
        },
        'yipeemon_cadvisor': {
          'image': 'google/cadvisor:v0.27.1',
          'deploy': {
            'mode': 'allnodes'
          },
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'secrets': [],
          'volumes': [
            '/:/rootfs:ro',
            '/var/run:/var/run',
            '/sys:/sys:ro',
            '/var/lib/docker/:/var/lib/docker:ro'
          ],
          'networks': {
            'yipee-monitoring-net': {
              'aliases': [
                'cadvisor'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipeemon_prometheus': {
          'image': 'yipeeio/prometheus',
          'deploy': {
            'mode': 'allnodes'
          },
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'command': [
            '-config.file=/etc/prometheus/prometheus.yml',
            '-storage.local.path=/prometheus',
            '-web.console.libraries=/etc/prometheus/console_libraries',
            '-web.console.templates=/etc/prometheus/consoles',
            '-storage.local.target-heap-size=1073741824',
            '-storage.local.retention=200h'
          ],
          'secrets': [],
          'volumes': [
            ':/prometheus'
          ],
          'networks': {
            'yipee-monitoring-net': {
              'aliases': [
                'prometheus'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        'yipeemon_nodeexporter': {
          'image': 'prom/node-exporter:v0.15.0',
          'deploy': {
            'mode': 'allnodes'
          },
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'command': [
            '--path.procfs=/host/proc',
            '--path.sysfs=/host/sys',
            '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
          ],
          'secrets': [],
          'volumes': [
            '/proc:/host/proc:ro',
            '/sys:/host/sys:ro',
            '/:/rootfs:ro'
          ],
          'networks': {
            'yipee-monitoring-net': {
              'aliases': [
                'nodeexporter'
              ]
            }
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        }
      }
    },
    'id': '4b8f5de2-ce14-11e7-991b-839ff17ec0ff',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver_opts': [],
          'name': 'yipeemon_grafana_data',
          'id': 'b60ae965-740e-46d5-860c-66a823ad0318'
        },
        {
          'driver_opts': [],
          'name': 'yipeemon_prometheus_data',
          'id': '5860c23b-ed95-4cb1-bcdb-95397a5bb665'
        }
      ],
      'networks': [
        {
          'name': 'yipee-monitoring-net',
          'id': 'c479ec5e-3e18-4be3-abcc-b0d9f4a630a3'
        }
      ],
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'urg',
        'readme': '',
        'description': '[insert app description here]',
        'id': '92806bb8-dfea-4dcc-b908-d4d38c44c723'
      },
      'services': [
        {
          'restart': 'always',
          'name': 'uicvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '42e46d55-86e2-4a93-bfe8-e915e55a1eaa'
            }
          ],
          'id': '6bf14e6a-5943-4bce-b615-6cd6224d6c81',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/uicvt',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'yipee_validator',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '11a8e2c0-7224-452d-85dc-e9405d3d334d'
            }
          ],
          'ports': [
            '9099:9099'
          ],
          'id': '5cd52a4f-cf67-4286-ab3d-d709473ed0f6',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-validation-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'name': 'yipeemon_cadvisor',
          'volumes': [
            '/:/rootfs:ro',
            '/sys:/sys:ro',
            '/var/lib/docker/:/var/lib/docker:ro',
            '/var/run:/var/run'
          ],
          'networks': [
            {
              'aliases': [
                'cadvisor'
              ],
              'name': 'yipee-monitoring-net',
              'id': 'a573d718-53b7-47ac-a2fd-d6c09ce720db'
            }
          ],
          'id': 'e972d24d-54cc-4f09-9658-dc04c1aad5e9',
          'image': 'google/cadvisor:v0.27.1',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'deploy': {
            'mode': 'allnodes',
            'id': '818c79e8-299e-4845-9013-605b6368d672'
          }
        },
        {
          'restart': 'always',
          'name': 'backend',
          'depends_on': [
            'oscvt',
            'uicvt',
            'composecvt',
            'kubecvt',
            'yipee_validator',
            'db',
            'auth',
            'secret_scanner'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '79f41ac7-5611-45bd-9300-506b8f896e10'
            }
          ],
          'ports': [
            '5000:3000'
          ],
          'id': '183f041f-f205-4152-b380-7dfad0619bde',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/dokken:uifmt',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[0]',
                'varname': 'CALLBACK_HOST'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[2]',
                'varname': 'CLIENT_SECRET'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[11]',
                'varname': 'YIPEE_TEAM_OWNER'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'CLIENT_ID'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
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
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'name': 'yipeemon_nodeexporter',
          'command': [
            '--path.procfs=/host/proc',
            '--path.sysfs=/host/sys',
            '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
          ],
          'volumes': [
            '/:/rootfs:ro',
            '/proc:/host/proc:ro',
            '/sys:/host/sys:ro'
          ],
          'networks': [
            {
              'aliases': [
                'nodeexporter'
              ],
              'name': 'yipee-monitoring-net',
              'id': '31ebca10-c544-41b2-8359-da773f8db208'
            }
          ],
          'id': '8084270d-daf2-465c-8d7b-9f85578704a9',
          'image': 'prom/node-exporter:v0.15.0',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'deploy': {
            'mode': 'allnodes',
            'id': 'c316bcf0-e236-4198-9a7f-966d9557ec68'
          }
        },
        {
          'name': 'db',
          'id': '5dc0c7f4-69f9-4177-843f-386142cc4212',
          'networks': [
            {
              'name': 'default',
              'id': '25d9cecf-ff72-461b-88d1-5c8aa2cc92e7'
            }
          ],
          'image': 'postgres:9.5.5-alpine',
          'volumes': [],
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'secret_scanner',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'b77bb482-fe47-4cf6-acb7-66979f355f1c'
            }
          ],
          'id': '547bce9a-74ea-4ad8-8d3c-15592933a841',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-secret-scanner',
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]'
          }
        },
        {
          'restart': 'always',
          'name': 'ui',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '569fd1e9-68ed-47e5-ae6b-65a75b88ff4d'
            }
          ],
          'ports': [
            '8443:443',
            '8080:80'
          ],
          'id': '648acdb4-16cf-4fd4-96b8-1643ab16d929',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/korn',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'API_HOST=backend:3000',
            'CORS_POLICY=app.yipee.io|github.com'
          ]
        },
        {
          'restart': 'always',
          'name': 'kubecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': 'aac1cf5c-edd5-48a2-abec-ab948a459b16'
            }
          ],
          'id': '16fb5b04-a80d-443b-ba9c-fe09a997fb97',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-kubernetes-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'name': 'yipeemon_prometheus',
          'command': [
            '-config.file=/etc/prometheus/prometheus.yml',
            '-storage.local.path=/prometheus',
            '-web.console.libraries=/etc/prometheus/console_libraries',
            '-web.console.templates=/etc/prometheus/consoles',
            '-storage.local.target-heap-size=1073741824',
            '-storage.local.retention=200h'
          ],
          'volumes': [
            ':/prometheus'
          ],
          'networks': [
            {
              'aliases': [
                'prometheus'
              ],
              'name': 'yipee-monitoring-net',
              'id': 'f52d91da-afa3-4095-9212-f80ce623ffb5'
            }
          ],
          'id': '9a761136-9ea4-4d09-84db-efe8a01f3c4d',
          'image': 'yipeeio/prometheus',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'deploy': {
            'mode': 'allnodes',
            'id': 'd51be006-b599-4c34-9308-d0a41bfd2c25'
          }
        },
        {
          'restart': 'always',
          'name': 'oscvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '81cde4fb-d529-49ee-a11d-888eba6c79ab'
            }
          ],
          'id': 'cf829918-2f03-4938-a7c2-f5a92fe849d6',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-openshift-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'name': 'auth',
          'depends_on': [
            'db'
          ],
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '5a537c8c-ba32-43e4-b10b-03a00f759899'
            }
          ],
          'ports': [
            '8128:8128'
          ],
          'id': '7a272be5-60bc-42cc-a313-261b4681fa28',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-auth',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'YIPEE_TEAM_OWNER'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
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
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'name': 'yipeemon_caddy',
          'volumes': [],
          'networks': [
            {
              'aliases': [
                'caddy'
              ],
              'name': 'yipee-monitoring-net',
              'id': '3f01f5f4-8ce3-473a-b60d-2fca3388c453'
            }
          ],
          'ports': [
            '3000:3000',
            '9090:9090'
          ],
          'id': '50208dc4-7099-4607-938d-b82e90b33990',
          'image': 'yipeeio/caddy',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}',
            'ADMIN_USER=${ADMIN_USER:-admin}'
          ],
          'deploy': {
            'mode': 'allnodes',
            'id': 'faa0d514-23a3-4c7e-9546-12c56c5f3a6b'
          }
        },
        {
          'labels': [
            'org.label-schema.group=monitoring'
          ],
          'name': 'yipeemon_grafana',
          'volumes': [
            ':/var/lib/grafana'
          ],
          'networks': [
            {
              'aliases': [
                'grafana'
              ],
              'name': 'yipee-monitoring-net',
              'id': 'b14ee7b9-edf4-4af3-980d-5ed76f390fa2'
            }
          ],
          'id': '4a58a757-0fcd-44a0-bed3-8a58525e8663',
          'image': 'yipeeio/grafana',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'GF_DASHBOARDS_JSON_ENABLED=true',
            'GF_DASHBOARDS_JSON_PATH=/dashboards',
            'GF_SECURITY_ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}',
            'GF_SECURITY_ADMIN_USER=${ADMIN_USER:-admin}',
            'GF_USERS_ALLOW_SIGN_UP=false'
          ],
          'deploy': {
            'mode': 'allnodes',
            'id': 'efd66af8-5c78-4ea6-9493-ccd87fb8c87b'
          }
        },
        {
          'restart': 'always',
          'name': 'composecvt',
          'volumes': [],
          'networks': [
            {
              'name': 'default',
              'id': '5c43c031-aca9-4d3b-b0ef-5506e8c157db'
            }
          ],
          'id': '47e8e7e9-0a0b-46bf-9f6a-d754c7fcf47d',
          'image': 'yipee-tools-spoke-cos.ca.com:5000/yipee-cvt-compose-svc',
          'annotations': {
            'description': '[insert description of service here]',
            'override': 'none'
          }
        }
      ]
    }
  },
  {
    '_id': '3d2954c6-d51f-11e7-8160-df46d0655877',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'iii',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'joomla',
      'mariadb'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'joomla\':{\'top\':450,\'left\':750,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'mariadb\':{\'top\':450,\'left\':500,\'description\':\'[insert description of service here]\',\'type\':\'default\',\'tag\':\'10.1.26-r2\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'php_data\':{\'name\':\'php_data\',\'top\':600,\'left\':808.3333333333334},\'apache_data\':{\'name\':\'apache_data\',\'top\':450,\'left\':1058.3333333333333},\'joomla_data\':{\'name\':\'joomla_data\',\'top\':300,\'left\':808.3333333333334},\'mariadb_data\':{\'name\':\'mariadb_data\',\'top\':450,\'left\':308.3333333333333}}}',
    'logodata': null,
    'revcount': 3,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/iii.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-11-29T16:06:20.488686+00:00',
    'dateModified': '2017-11-29T16:08:00.822284+00:00',
    'yipeeFile': {
      'secrets': {},
      'volumes': {
        'php_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'apache_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'joomla_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'mariadb_data': {
          'driver': 'local',
          'driver_opts': {}
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'iii',
        'readme': '',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'joomla': {
          'image': 'bitnami/joomla:latest',
          'ports': [
            '80:80',
            '443:443'
          ],
          'secrets': [],
          'volumes': [
            ':/bitnami/joomla',
            ':/bitnami/apache',
            ':/bitnami/php'
          ],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'JOOMLA_PASSWORD',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        'mariadb': {
          'image': 'bitnami/mariadb:10.1.26-r2',
          'ports': [
            '3306:3306'
          ],
          'secrets': [],
          'volumes': [
            ':/bitnami/mariadb'
          ],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'MARIADB_DATABASE',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_PASSWORD',
                'reference': 'environment[2]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      }
    },
    'id': '3d2954c6-d51f-11e7-8160-df46d0655877',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'php_data',
          'id': '48034cc4-ab35-4acb-a15d-1cd27fafaa80'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'apache_data',
          'id': 'b85870cc-15dd-45c0-b5c3-0965b039770c'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'joomla_data',
          'id': 'b0febe44-c9d2-42cd-84f1-8f9092550517'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'mariadb_data',
          'id': 'f6e4e2f2-5446-404e-a948-5d6f5a2eb8b6'
        }
      ],
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'iii',
        'readme': '',
        'description': '[insert app description here]',
        'id': '7ced40eb-679b-4912-a917-f685b8611c67'
      },
      'networks': [],
      'services': [
        {
          'name': 'joomla',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            ':/bitnami/joomla',
            ':/bitnami/apache',
            ':/bitnami/php'
          ],
          'networks': [
            {
              'name': 'default',
              'id': 'ec19e757-487d-4e67-b66e-8f1f4af862db'
            }
          ],
          'ports': [
            '80:80',
            '443:443'
          ],
          'id': 'fa683595-1913-42bd-9098-2d8664458b6d',
          'image': 'bitnami/joomla:latest',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'JOOMLA_PASSWORD'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        {
          'name': 'mariadb',
          'volumes': [
            ':/bitnami/mariadb'
          ],
          'networks': [
            {
              'name': 'default',
              'id': '4b39a47a-6ecf-4f56-87e0-d2759d8f927a'
            }
          ],
          'ports': [
            '3306:3306'
          ],
          'id': '26e37410-a8b3-49f5-9d75-3d39b29b1527',
          'image': 'bitnami/mariadb:10.1.26-r2',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[2]',
                'varname': 'MARIADB_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'MARIADB_DATABASE'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      ]
    }
  },
  {
    '_id': '7fb6c660-d520-11e7-8861-27010090ac55',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'bar',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'joomla',
      'mariadb'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'joomla\':{\'top\':450,\'left\':750,\'description\':\'\',\'type\':\'default\',\'tag\':\'latest\',\'typeConversionHistory\':{\'default\':true}},\'mariadb\':{\'top\':450,\'left\':500,\'description\':\'\',\'type\':\'default\',\'tag\':\'10.1.26-r2\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{\'mariadb_data\':{\'name\':\'mariadb_data\',\'top\':450,\'left\':308.3333333333333},\'joomla_data\':{\'name\':\'joomla_data\',\'top\':300,\'left\':808.3333333333334},\'apache_data\':{\'name\':\'apache_data\',\'top\':450,\'left\':1058.3333333333333},\'php_data\':{\'name\':\'php_data\',\'top\':600,\'left\':808.3333333333334}}}',
    'logodata': null,
    'revcount': 1,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/bar.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-11-29T16:15:21.642393+00:00',
    'dateModified': '2017-11-29T16:15:30.41621+00:00',
    'yipeeFile': {
      'secrets': {},
      'volumes': {
        'php_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'apache_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'joomla_data': {
          'driver': 'local',
          'driver_opts': {}
        },
        'mariadb_data': {
          'driver': 'local',
          'driver_opts': {}
        }
      },
      'app-info': {
        'logo': '[insert name of app logo image here]',
        'name': 'bar',
        'readme': '',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'joomla': {
          'image': 'bitnami/joomla:latest',
          'ports': [
            '443:443',
            '80:80'
          ],
          'secrets': [],
          'volumes': [
            'joomla_data:/bitnami/joomla',
            'apache_data:/bitnami/apache',
            'php_data:/bitnami/php'
          ],
          'networks': {
            'default': {}
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'JOOMLA_PASSWORD',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        'mariadb': {
          'image': 'bitnami/mariadb:10.1.26-r2',
          'ports': [
            '3306:3306'
          ],
          'secrets': [],
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': {
            'default': {}
          },
          'annotations': {
            'override': 'none',
            'description': '[insert description of service here]',
            'externalenv': [
              {
                'varname': 'MARIADB_PASSWORD',
                'reference': 'environment[2]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_ROOT_PASSWORD',
                'reference': 'environment[4]',
                'description': '[insert description of environment variable here]'
              },
              {
                'varname': 'MARIADB_DATABASE',
                'reference': 'environment[1]',
                'description': '[insert description of environment variable here]'
              }
            ]
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      }
    },
    'id': '7fb6c660-d520-11e7-8861-27010090ac55',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'apache_data',
          'id': '438768d9-1f2c-4df1-9c52-bc0628580f5d'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'joomla_data',
          'id': '7eba5b3b-07bf-4f90-bf0d-9e46b550aef4'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'mariadb_data',
          'id': 'd72a4c7f-2734-4fd5-8581-8f8943df7625'
        },
        {
          'driver': 'local',
          'driver_opts': [],
          'name': 'php_data',
          'id': '300c831e-13b4-4ad0-b7e4-97565c5df969'
        }
      ],
      'appinfo': {
        'logo': '[insert name of app logo image here]',
        'name': 'bar',
        'readme': '',
        'description': '[insert app description here]',
        'id': '0c409cb6-94ec-472e-8b6d-a587e2d83a6c'
      },
      'networks': [],
      'services': [
        {
          'name': 'joomla',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            'apache_data:/bitnami/apache',
            'joomla_data:/bitnami/joomla',
            'php_data:/bitnami/php'
          ],
          'networks': [
            {
              'name': 'default',
              'id': '1a80bb78-4a58-4cda-b9cd-af3cb84bf3fb'
            }
          ],
          'ports': [
            '80:80',
            '443:443'
          ],
          'id': 'e2608552-373c-4655-a68e-a804ed1964aa',
          'image': 'bitnami/joomla:latest',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'JOOMLA_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'JOOMLA_EMAIL=user@example.com',
            'JOOMLA_PASSWORD=${JOOMLA_PASSWORD}',
            'JOOMLA_USERNAME=user',
            'MARIADB_HOST=mariadb',
            'MARIADB_PASSWORD=${MARIADB_ROOT_PASSWORD}',
            'MARIADB_PORT=3306'
          ]
        },
        {
          'name': 'mariadb',
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': [
            {
              'name': 'default',
              'id': '3309601c-54d1-4b8e-9ce5-40025a0735e0'
            }
          ],
          'ports': [
            '3306:3306'
          ],
          'id': 'f982956b-98da-4f59-b666-5874b685f0c5',
          'image': 'bitnami/mariadb:10.1.26-r2',
          'annotations': {
            'externalenv': [
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[1]',
                'varname': 'MARIADB_DATABASE'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[2]',
                'varname': 'MARIADB_PASSWORD'
              },
              {
                'description': '[insert description of environment variable here]',
                'reference': 'environment[4]',
                'varname': 'MARIADB_ROOT_PASSWORD'
              }
            ],
            'description': '[insert description of service here]',
            'override': 'none'
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes',
            'MARIADB_DATABASE=${MARIADB_DATABASE}',
            'MARIADB_PASSWORD=${MARIADB_PASSWORD}',
            'MARIADB_PORT=3306',
            'MARIADB_ROOT_PASSWORD=${MARIADB_ROOT_PASSWORD}'
          ]
        }
      ]
    }
  },
  {
    '_id': '9bec4af8-d520-11e7-8234-975696d31c94',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'Gurflunge',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'joomla',
      'mariadb',
      'racket'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': null,
    'logodata': null,
    'revcount': 2,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/gurflunge.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-11-29T16:16:08.969386+00:00',
    'dateModified': '2017-12-11T22:11:26.678203+00:00',
    'yipeeFile': {
      'volumes': {
        'php_data': {
          'driver': 'local',
          'annotations': {
            'ui': {
              'canvas': {
                'id': 'dc0cc117-19c1-eb74-5109-98f452c9f348',
                'position': {
                  'x': 250,
                  'y': 250
                }
              }
            },
            'description': '[insert description of volume here]'
          }
        },
        'apache_data': {
          'driver': 'local',
          'annotations': {
            'ui': {
              'canvas': {
                'id': 'f454a351-9ed8-07a7-bd76-090c2474f160',
                'position': {
                  'x': 400,
                  'y': 250
                }
              }
            },
            'description': '[insert description of volume here]'
          }
        },
        'joomla_data': {
          'driver': 'local',
          'annotations': {
            'ui': {
              'canvas': {
                'id': 'f776271c-29ee-460a-07e5-70333a3e6a9e',
                'position': {
                  'x': 550,
                  'y': 250
                }
              }
            },
            'description': '[insert description of volume here]'
          }
        },
        'mariadb_data': {
          'driver': 'local',
          'annotations': {
            'ui': {
              'canvas': {
                'id': 'a838d553-e885-6c7a-1b85-1b5dfc5ff04c',
                'position': {
                  'x': 100,
                  'y': 400
                }
              }
            },
            'description': '[insert description of volume here]'
          }
        }
      },
      'app-info': {
        'ui': {
          'canvas': {
            'defaultNetwork': {
              'position': {
                'x': 100,
                'y': 100
              }
            }
          }
        },
        'logo': '[insert name of app logo image here]',
        'name': 'Gurflunge',
        'readme': '# READ ME!!!!',
        'description': '[insert app description here]'
      },
      'networks': {},
      'services': {
        'joomla': {
          'build': '',
          'image': 'bitnami/joomla:latest',
          'ports': [
            '80:80',
            '443:443'
          ],
          'restart': 'always',
          'volumes': [
            'apache_data:/bitnami/apache',
            'joomla_data:/bitnami/joomla',
            'php_data:/bitnami/php'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'depends_on': [
            'mariadb'
          ],
          'annotations': {
            'ui': {
              'canvas': {
                'id': '5fd30739-75f9-67e1-1de4-c0b0758f5513',
                'position': {
                  'x': 325,
                  'y': 100
                }
              }
            },
            'override': 'none',
            'description': '[insert description of service here]',
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': ''
            }
          },
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': []
          }
        },
        'racket': {
          'build': '',
          'image': 'jackfirth/racket:6.10',
          'restart': 'always',
          'volumes': [],
          'annotations': {
            'ui': {
              'canvas': {
                'id': '55b5eb79-78c5-e8aa-3c27-236dbc2d7e63',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            },
            'override': 'none',
            'description': '',
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': ''
            }
          },
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': []
          }
        },
        'mariadb': {
          'build': '',
          'image': 'bitnami/mariadb:latest',
          'restart': 'always',
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'ui': {
              'canvas': {
                'id': '5be79795-f35d-09fb-7158-3e4c62a56a77',
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            },
            'override': 'none',
            'description': '[insert description of service here]',
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': ''
            }
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes'
          ],
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': []
          }
        }
      }
    },
    'id': '9bec4af8-d520-11e7-8234-975696d31c94',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'volumes': [
        {
          'driver': 'local',
          'name': 'php_data',
          'id': '6e5c0c0a-f086-47c6-b284-fe9136a78ddb',
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'dc0cc117-19c1-eb74-5109-98f452c9f348',
                'position': {
                  'x': 250,
                  'y': 250
                }
              }
            }
          }
        },
        {
          'driver': 'local',
          'name': 'apache_data',
          'id': 'cc34f352-1826-4515-8ff9-2c060b1e5576',
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'f454a351-9ed8-07a7-bd76-090c2474f160',
                'position': {
                  'x': 400,
                  'y': 250
                }
              }
            }
          }
        },
        {
          'driver': 'local',
          'name': 'joomla_data',
          'id': 'dfe0eeac-a6d1-4625-b735-253d3002e4a9',
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'f776271c-29ee-460a-07e5-70333a3e6a9e',
                'position': {
                  'x': 550,
                  'y': 250
                }
              }
            }
          }
        },
        {
          'driver': 'local',
          'name': 'mariadb_data',
          'id': '23619b56-ef18-4203-8294-e40923dd9b93',
          'annotations': {
            'description': '[insert description of volume here]',
            'ui': {
              'canvas': {
                'id': 'a838d553-e885-6c7a-1b85-1b5dfc5ff04c',
                'position': {
                  'x': 100,
                  'y': 400
                }
              }
            }
          }
        }
      ],
      'appinfo': {
        'ui': {
          'canvas': {
            'defaultNetwork': {
              'position': {
                'x': 100,
                'y': 100
              }
            }
          }
        },
        'logo': '[insert name of app logo image here]',
        'name': 'Gurflunge',
        'readme': '# READ ME!!!!',
        'description': '[insert app description here]',
        'id': '757958a5-e842-4477-9228-08f1ad6d1fca'
      },
      'networks': [],
      'services': [
        {
          'restart': 'always',
          'name': 'mariadb',
          'volumes': [
            'mariadb_data:/bitnami/mariadb'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '0aeea865-6896-4b72-a8cc-091513903a68'
            }
          ],
          'build': '',
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': [],
            'id': '78169eca-f926-4da1-a897-d8bedb4fb436'
          },
          'id': '5fb67d93-69c4-4adb-8d19-d58516b56d39',
          'image': 'bitnami/mariadb:latest',
          'annotations': {
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP',
              'id': 'b181ce64-24df-4a2f-aeca-7e50294dd7b2'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': '',
              'id': 'a1862254-f8a7-408a-aadf-22fe9cd0e4e8'
            },
            'description': '[insert description of service here]',
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '5be79795-f35d-09fb-7158-3e4c62a56a77',
                'position': {
                  'x': 100,
                  'y': 250
                }
              }
            }
          },
          'environment': [
            'ALLOW_EMPTY_PASSWORD=yes'
          ]
        },
        {
          'restart': 'always',
          'name': 'joomla',
          'depends_on': [
            'mariadb'
          ],
          'volumes': [
            'apache_data:/bitnami/apache',
            'joomla_data:/bitnami/joomla',
            'php_data:/bitnami/php'
          ],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': '6b631ee0-7e98-4dc5-87bb-5735bf475766'
            }
          ],
          'ports': [
            '80:80',
            '443:443'
          ],
          'build': '',
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': [],
            'id': '268dab56-c7cc-4575-aa74-55767342d4ad'
          },
          'id': 'a9365e41-f0a9-4f0a-8982-f510683f1bb3',
          'image': 'bitnami/joomla:latest',
          'annotations': {
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP',
              'id': '07a7395f-f7e8-48f5-a7d7-10386ed03e5c'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': '',
              'id': 'b704a8a7-dce9-477b-a464-ae8ca9986a19'
            },
            'ui': {
              'canvas': {
                'id': '5fd30739-75f9-67e1-1de4-c0b0758f5513',
                'position': {
                  'x': 325,
                  'y': 100
                }
              }
            },
            'description': '[insert description of service here]',
            'override': 'none'
          }
        },
        {
          'restart': 'always',
          'name': 'racket',
          'volumes': [],
          'build': '',
          'healthcheck': {
            'retries': 0,
            'timeout': 0,
            'interval': 0,
            'healthcmd': [],
            'id': '3653a306-7ed8-45ee-93ae-787f7c355f90'
          },
          'id': '98cf8a3f-8c9d-4f8f-a6a8-e232ca773263',
          'image': 'jackfirth/racket:6.10',
          'annotations': {
            'external_config': {
              'image': 'HAProxy',
              'server': '',
              'proxy-type': 'HTTP',
              'id': 'cb46fe02-2009-4969-89c5-421077e500af'
            },
            'development_config': {
              'tag': '',
              'image': '',
              'repository': '',
              'id': '21731f10-faea-4ace-8e73-e44b8d03e041'
            },
            'description': '',
            'override': 'none',
            'ui': {
              'canvas': {
                'id': '55b5eb79-78c5-e8aa-3c27-236dbc2d7e63',
                'position': {
                  'x': 100,
                  'y': 100
                }
              }
            }
          }
        }
      ]
    }
  },
  {
    '_id': 'a1551fcc-e69d-11e7-855c-87e77d2a5c44',
    'repo': null,
    'branch': null,
    'path': null,
    'name': 'racket-with-secret',
    'author': 'jrryjcksn',
    'username': 'jrryjcksn',
    'containers': [
      'racket'
    ],
    'sha': null,
    'downloads': 0,
    'likes': 0,
    'canvasdata': '{\'containers\':{\'racket\':{\'top\':113,\'left\':78,\'author\':\'jackfirth\',\'description\':\'Docker images for the Racket programming language\',\'type\':\'default\',\'tagList\':[\'6.5-onbuild-test\',\'6.5-onbuild\',\'6.4-onbuild-test\',\'6.4-onbuild\',\'6.3-onbuild-test\',\'6.3-onbuild\',\'6.2-onbuild-test\',\'6.2-onbuild\',\'6.2.1-onbuild-test\',\'6.2.1-onbuild\'],\'repo\':\'DockerHub\',\'tag\':\'6.5-onbuild-test\',\'typeConversionHistory\':{\'default\':true}}},\'volumes\':{}}',
    'logodata': null,
    'revcount': 5,
    'ownerorg': '6e0a6206-1558-11e7-a0fe-e7a448f880d1',
    'fullname': 'jrryjcksn@github/e@no@ent/jrryjcksn/racket-with-secret.yipee',
    'orgname': 'jrryjcksn',
    'isPrivate': true,
    'dateCreated': '2017-12-21T22:23:54.902407+00:00',
    'dateModified': '2018-01-03T22:18:46.624008+00:00',
    'yipeeFile': {
      'secrets': {
        'Secret1': {
          'external': true,
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true'
            }
          }
        }
      },
      'volumes': {},
      'app-info': {
        'name': 'racket-with-secret',
        'readme': '',
        'description': ''
      },
      'networks': {},
      'services': {
        'racket': {
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'ports': [
            '80:80'
          ],
          'secrets': [
            {
              'gid': '0',
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'target': 'SikhRhett'
            }
          ],
          'volumes': [],
          'networks': {
            'default': {
              'aliases': []
            }
          },
          'annotations': {
            'override': 'none',
            'description': 'Docker images for the Racket programming language'
          }
        }
      }
    },
    'id': 'a1551fcc-e69d-11e7-855c-87e77d2a5c44',
    'hasLogo': false,
    'flatFile': [],
    'uiFile': {
      'appinfo': {
        'name': 'racket-with-secret',
        'readme': '',
        'description': '',
        'id': '570b43f7-8cc1-4817-b70b-845c275d4e06'
      },
      'secrets': [
        {
          'name': 'Secret1',
          'external': true,
          'id': '711e7ba3-abc0-4537-ae87-83245cf0fe02',
          'annotations': {
            'secret_config': {
              'file': '',
              'externalName': 'true',
              'id': 'bec51958-e0ed-4397-b896-336cb3162c50'
            }
          }
        }
      ],
      'volumes': [],
      'networks': [],
      'services': [
        {
          'secrets': [
            {
              'uid': '0',
              'mode': '444',
              'source': 'Secret1',
              'gid': '0',
              'id': 'c54b8a29-7307-46f9-8a2b-5752903da62d',
              'target': 'SikhRhett'
            }
          ],
          'name': 'racket',
          'volumes': [],
          'networks': [
            {
              'aliases': [],
              'name': 'default',
              'id': 'e26fe6e1-0cee-4118-bedd-2b771a7936cd'
            }
          ],
          'ports': [
            '80:80'
          ],
          'id': 'cf9eaf6c-be46-49a1-a8a8-6e3730e7372a',
          'image': 'jackfirth/racket:6.5-onbuild-test',
          'annotations': {
            'description': 'Docker images for the Racket programming language',
            'override': 'none'
          }
        }
      ]
    }
  }
];

describe('YipeeFileMetadataRaw', () => {

  it('should parse jerrys private app list', () => {
    for (const raw of jerryRawData) {
      const meta = new YipeeFileMetadata(raw);
      expect(meta).toBeDefined();
    }
  });

  it('should parse jims private app list', () => {
    for (const raw of jimRawData) {
      const meta = new YipeeFileMetadata(raw);
      expect(meta).toBeDefined();
    }
  });

  it('should parse jims2 private app list', () => {
    for (const raw of jim2RawData) {
      const meta = new YipeeFileMetadata(raw);
      expect(meta).toBeDefined();
    }
  });

});
