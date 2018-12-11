# Flat Format
## Flat Format "Objects"
The term "Flat Format" refers to the lack of (most) hierarchical
structure in the model below. Any relationships between objects are
managed via *id* references. A flat format document consists of a map
from object type names to arrays of corresponding objects. In addition
to the specific fields mentioned below, each object contains a *type*
field whose value is the string name of the object type and an *id*
field containing a uuid string uniquely representing the object. We
intend that some objects will contain attributes specific to
particular orchestrators. Because of this, it's critical that users
overwrite fields within an existing object rather than construct
instances from scratch so any "extra" information used internally is
not lost.


### Orchestrator Agnostic

### Kubernetes Only

### Compose Only
