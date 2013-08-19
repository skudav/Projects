﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace InventoryApp
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();
        }
        protected void FormsAuthentication_OnAuthenticate(Object sender, FormsAuthenticationEventArgs e)
        {
            //if (FormsAuthentication.CookiesSupported == true)
            //{
            if (Request.Cookies[FormsAuthentication.FormsCookieName] != null)
            {
                try
                {
                    //let us take out the username now                
                    string username = FormsAuthentication.Decrypt(Request.Cookies[FormsAuthentication.FormsCookieName].Value).Name;
                    string roles = string.Empty;

                    ////tHE CODE TO OBTAIN THE ROLES FOR THE USERS, WILL USE A SERVICE
                    //using (userDbEntities entities = new userDbEntities())
                    //{
                    //    User user = entities.Users.SingleOrDefault(u => u.username == username);

                    //    roles = user.Roles;
                    //}
                    //let us extract the roles from our own custom cookie
                    //tEMPP HARD CODE TO A STRING SEPEARATDD BY ;

                    roles = "admin";

                    
                    //Let us set the Pricipal with our user specific details
                    e.User = new System.Security.Principal.GenericPrincipal(
                      new System.Security.Principal.GenericIdentity(username, "Forms"), roles.Split(';'));
                }
                catch (Exception)
                {
                    //somehting went wrong
                }
            }
            //  }
        }
    }
}