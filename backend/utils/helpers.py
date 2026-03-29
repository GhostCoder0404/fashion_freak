from bson.objectid import ObjectId
def oid(s):
    return ObjectId(s) if isinstance(s, str) else s
