const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get all users with no limit
        const users = await db.asServiceRole.entities.User.list();
        
        return Response.json({ 
            total: users.length,
            verified: users.filter(u => u.is_verified).length,
            unverified: users.filter(u => !u.is_verified).length
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});