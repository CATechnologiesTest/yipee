**Comprehensive list of metrics and their attributes sent from both the front end and back end.**
# Naming Convention

Pattern will be Verb - Noun - Action/result  eg.  SignupClicked, CreateModel, ForkModel, ImportModel, ImportModelFailed  - something that doesn’t succeed use “Failure”

# Track Calls

*BackEnd*

({
    userId: (Username of user)
    event: 'Activated',
    properties: {
        ActivatedOn: (Date and time user activated)
    }
});

({
    userId: (Username of user)
    event: 'DownloadAPI',
    properties: {
        fileId: (UID of model in database)
        fileName: (Name of model)
        downloadType: (Type can equal Openshift, Kubernetes, Helm, OpenshiftArchive, and KubernetesArchive)
        contextId: (Id the user is currently in)
        contextIsOwner: (True or false boolean indicating if user is the owner of context)
    }
});

({
    userId: userId,
    event: 'TrackingPrevented',
    anonymousId = anonId
});

*FrontEnd*

### ('AddAccountShare', {
  teamOrg: (UID of team/user account in Database)
  teamName: (Name of the user context)
  teamUserName: (Username of the user being added to view the users account)
});

### ('AddContainer', {
  source: ('NewImage' or 'Search' / New image = user created the service, search = added from docker hub)
  containerName: (Name of container that user created)
  modelType: (Can contain k8s or c11y)
});

### ('AddContainerGroup', {
  containerGroupName: (Name of containerGroup that user created)
  containerType: (Can contain StatefulSet or Deployment)
  modelType: (Can contain k8s or c11y)
});

### ('AddNetwork', {
  volumeName: (Name of network that user created)
  modelType: (Can contain k8s or c11y)
});

### ('AddSecret' {
  modelType: (Can contain k8s or c11y)
});

### ('AddService', {
  source: ('NewImage' or 'Search' / New image = user created the service, search = added from docker hub)
  serviceName: (Name of service that user created or added from search)
  modelType: (Can contain k8s or c11y)
});

### ('AddTeamMember', {
  teamOrg: (UID of team/user account in Database)
  teamName: (Name of the team)
  teamUserName: (Username of the user being added to the team)
});

### ('AddVolume', {
  volumeName: (Name of volume that user created)
  modelType: (Can contain k8s or c11y)
});

### ('AutoLayoutModel', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('ClickedShareModel', {
  modelType: (Can contain k8s or c11y)
});

### ('CloneContainer', {
  containerName: (Name of the clone / name of container with a '-#' after original name)
  modelType: (Can contain k8s or c11y)
});

### ('CloneContainerGroup', {
  containerGroupName: (Name of the clone / name of containerGroup with a '-#' after original name)
  modelType: (Can contain k8s or c11y)
});

### ('CloneNetwork', {
  networkName: (Name of the clone / name of network with a '-#' after original name)
  modelType: (Can contain k8s or c11y)
});

### ('CloneVolume', {
  volumeName: (Name of the clone / name of volume with a '-#' after original name)
  modelType: (Can contain k8s or c11y)
});

### ('CloneService', {
  serviceName: (Name of the clone / name of service with a '-#' after original name)
  modelType: (Can contain k8s or c11y)
});

### ('CloseModel', {
  fileId: (UID of model in database)
  appName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('CloseModelWithChanges', {
  fileId: (UID of model in database)
  appName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('CloseProgressBar', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CompletedStepOne', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CompletedStepTwo', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CompletedStepThree', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CompletedStepFour', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CompletedProgressBar', {
  appName: (Name of model)
  fileId: (UID of model in database)
  modelType: (Can contain k8s or c11y)
});

### ('CreateTeamClicked');

### ('CreateTeamFailure', {
  error: (Contains validation errors or errors from the backend)
});

### ('CreateTeamSuccessful', {
  teamName: (Name of the team created)
});

### ('DeepLinkedModel', {
  url: (URL that user is currently on)
  fileId: (UID of model in database the user is deep linking into)
});

### ('DeleteAccountShare', {
  teamOrg: (UID of organization in database)
  teamName: (Name of the user context)
  teamUserName: (User ID of the user being deleted from the context)
});

### ('DeleteContainer', {
  containerName: (name of the container being deleted)
  modelType: (Can contain k8s or c11y)
});

### ('DeleteContainerGroup', {
  containerGroupName: (name of the container being deleted)
  modelType: (Can contain k8s or c11y)
});

### ('DeletedModel', {
  fileName: (name of the model being deleted)
  fileIsPrivate: (boolean of true or false of is private file)
});

### ('DeleteNetwork', {
  networkName: (name of the network being deleted)
  modelType: (Can contain k8s or c11y)
});

### ('DeleteSecret' {
  modelType: (Can contain k8s or c11y)
});

### ('DeleteService', {
  serviceName: (name of the service being deleted)
  modelType: (Can contain k8s or c11y)
});

### ('DeleteTeamMember', {
  teamOrg: (UID of organization in database)
  teamName: (Name of the team)
  teamUserName: (User ID of the user being deleted from the team)
});

### ('DeleteVolume', {
  volumeName: (name of the volume being deleted)
  modelType: (Can contain k8s or c11y)
});

### ('DownloadAPIInfoClicked');

### ('DownloadedModel', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  fileType: (Type can equal Openshift, Kubernetes, Helm, OpenshiftArchive, and KubernetesArchive)
  modelType: (Can contain k8s or c11y)
  live: (Can contain true or false / true if live download, false if downloaded from backend)
});

### ('DownloadedPNG', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('DownloadedSVG', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('ForkModel', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  newAppName: (New name of model)
  modelType: (Can contain k8s or c11y)
});

### ('ImportModel', {
  fileName: (name of the model being deleted)
  fileIsPrivate: (Boolean of true or false of is private file)
  serviceCount: (Number of services in model)
  networkCount: (Number of networks in model)
  volumeCount: (Number of volumes in model)
  secretCount: (Number of secrets in model)
  containerCount: (Number of containers in model)
  containerGroupCount: (Number of containerGroups in model)
  modelType: (Can contain k8s or c11y)
});

### ('ImportModelFailure', {
  userError: (Contains errors from the backend)
  modelType: (Can contain k8s or c11y)
});

### ('LoginSuccessful', {
  userName: (Users github username)
  userSrc: (Is always 'Github', as it is the only Oauth we use)
});

### ('ModelMadePublic', {
  fileId: (UID of model in database)
  appName: (Name of model)
});

### ('ModifyReadme');

### ('NewModel', {
  fileName: (name of the model being deleted)
  fileIsPrivate: (boolean of true or false of is private file)
  fileType: (Is always 'new', can have 'fork' from depricated attribute before 'forkModel' metric was made)
  modelType: (Can contain k8s or c11y)
});

### ('OpenModel', {
  fileId: (UID of model in database)
  appName: (Name of model)
  serviceCount: (Number of services in model)
  networkCount: (Number of networks in model)
  volumeCount: (Number of volumes in model)
  secretCount: (Number of secrets in model)
  containerCount: (Number of containers in model)
  containerGroupCount: (Number of containerGroups in model)
  modelType: (Can contain k8s or c11y)
});

### ('OverrideService', {
  type: (Can be 'none', 'local', 'external', or 'development')
});

### ('PrintedModel', {
  fileId: (UID of model in database)
  fileName: (Name of model)
  modelType: (Can contain k8s or c11y)
});

### ('SavedModel', {
  appName: (Name of model)
  fileId: (UID of model in database)
  fileName: (name of the model being deleted)
  fileIsPrivate: (boolean of true or false of is private file)
  fileType: (Is always 'existing', can have 'new' from depricated attribute before 'newModel' metric was made)
  serviceCount: (Number of services in model)
  networkCount: (Number of networks in model)
  volumeCount: (Number of volumes in model)
  secretCount: (Number of secrets in model)
  containerCount: (Number of containers in model)
  containerGroupCount: (Number of containerGroups in model)
  modelType: (Can contain k8s or c11y)
});

### ('SearchService', {
  source: (Can be 'dockerhubOfficial' or 'dockerhub', gives place they are searching)
  term: (Term the user is searching for)
});

### ('SignupClicked');

### ('SignupFailure', {
  valid: (Contains errors from the backend)
});

### ('SignupSuccessful');

### ('SwitchContext', {
  fromContextId: (UID of context user is switching from)
  fromContextName: (Name of context user is switching from)
  toContextId: (UID of context user is switching to)
  toContextName: (Name of context user is switching to)
});

### ('UpdateTeamPermissions', {
  teamOrg: (UID of organization in database)
  teamName: (Name of the team)
  updatedUserId: (UID of the user in database)
  updatedUserName: (Github username of user being updated)
  userAdmin: (boolean of true or false for if user is admin)
  userWriter: (boolean of true or false for if user is writer)
});

### ('ViewCatalogListView');

### ('ViewCatalogPage', {
  name: 'Catalog',
  path: '/catalog',
  title: 'yipee.io'
});

### ('ViewEditorPage', {
  name: 'Editor',
  path: '/editor',
  title: 'yipee.io'
});

### ('ViewLoginPage', {
  name: 'Login',
  path: '/main/login',
  title: 'yipee.io'
});

### ('ViewNerdModePage', {
  type: (Can be 'openshift', 'kubernetes', or 'helm')
});

### ('ViewPublicCatalog');

### ('ViewSettingsPage', {
  name: 'Settings',
  path: '/main/settings',
  title: 'yipee.io'
});

### ('ViewSignupPage', {
  name: 'Signup',
  path: '/main/signup',
  title: 'yipee.io'
});


# PageCalls

### Catalog
('catalog', 'Catalog', '/catalog');

### Editor
('editor', 'Editor', '/editor');

### Login
('login', 'Login', '/login');

### Signup
('signup', 'Signup', '/signup');

# Identify Call

Attributes inside the identify call are for *front end* and *back end*

### identify(localUsername,
  Object.assign({
    firstName: (First name of user)
    lastName: (Last name of user)
    paidUser: (Boolean of true or false if user is a paid user)
    email: (Users email)
    plan: (Is always 'FreeTrial')
    phone: (Phone number of user)
    leadSrc: (User selected origin that the user heard about yipee)
    dockerExperience: (User selected experience level)
    whyYipee: (User selected reason for using yipee)
    activatedOn: (date and time of when the user became activated)
    activated: (boolean of true or false of if the user has become activated)
    UTMCampaign: (Mixpanel data for campaign)
    UTMContent: (Mixpanel data for content)
    UTMMedium: (Mixpanel data for medium)
    UTMSource: (Mixpanel data for source)
  },
  attributes (can contain k8sImport, and k8sImportEmail (k8sImport shows interest in importing k8s files, k8sImportEmail shows email where user would like to be contacted and give feedback.)
  context: {
    Intercom: { unsubscribedFromEmails: (Boolean of true or false if the user selected to receive emails from intercom) }
));
