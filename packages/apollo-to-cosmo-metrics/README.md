## Apollo To Cosmo Metrics

Cosmo schema usage metrics plugin for Apollo Gateway.

Plugin implementation currently missing some functionality, here is the list:

- Deduplication of type usage reports, all type reports coming always with count of 1
- Recursive processing of operation inputs, inputs that come as object variables are being collected max to level of 2. In case variable has deep structure (> 2) the implementation wont process it all
- Enum inputs are not being reported
- Operation errors are not being reported, only success ones (with code 200)
- Cosmo metrics client implementation uses static proto, it would be nice to make it dynamic, meaning having ability to pull always newest proto and generate new client based on that

However, plugin is stable and is able to report lots of standard schema usage, this version is used is production already, results can be seen in schema usage tab in cosmo studio.
