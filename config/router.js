'use strict';

const importer     = require('anytv-node-importer');
const verify_token = require(__dirname+'/../controllers/auth').verify_token;

module.exports = (router) => {
    const __   = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.post ('/user',                                  __.user.create);
    router.get  ('/user/:id',                              __.user.retrieve);
    router.put  ('/user/:id',                              __.user.update);
    router.del  ('/user/:id',                              __.user.delete);
    router.post ('/user/change_password',    verify_token, __.user.change_password);

    router.post ('/auth/login',                            __.auth.login);
    router.post ('/auth/logout',             verify_token, __.auth.logout);

    router.get  ('/package',                               __.pack.retrieve);
    router.get  ('/package/received',                      __.pack.received);
    router.post ('/package/create',                        __.pack.create_item);
    router.get  ('/package/:id',                           __.pack.retrieve_by_id);
    
    router.post ('/inbound/scan',                          __.inbound.scan_item); // hZJFcmL2f3

    router.post ('/courier/assignment',                    __.assignment.assign);
    router.get  ('/courier/assignment',                    __.assignment.get_assignment);
    router.get  ('/courier/assignment/:courier_id',        __.assignment.assignment_cour);

    router.all('*', (req, res) => {
        res.status(404)
           .send({message: 'Nothing to do here.'});
    });

    return router;
};