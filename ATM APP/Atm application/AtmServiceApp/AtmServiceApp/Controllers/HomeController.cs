using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;
using System.ServiceModel.Description;
using Microsoft.Crm.Services.Utility;
using Microsoft.Crm.Sdk.Messages;

using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Messages;
using AtmServiceApp.CRMService;


namespace AtmServiceApp.Controllers
{
    public class HomeController : Controller
    {
        public static long counter = 0;
        public ActionResult Index()
        {

            if (Request.IsAuthenticated)
            {
                return RedirectToAction("ATMForm", "Home");
            }
            else
            {
                ViewData["invalid"] = TempData["msg"];
                return View();
            }
        }

        public ActionResult Authenticate()
        {
            string usrname = string.Empty;
            string password = string.Empty;
            string clientid = string.Empty;
            bool isValid = false;
            string returnPath = string.Empty;

            usrname = Request.Form["user_name"];
            password = Request.Form["password3"];
            clientid = Request.Form["client_id"];

            string[] usernames = { "prasad", "akshay", "abhi", "virginia", "nymphia", "sonu", "navil" };
            string[] passwords = { "prasad1", "akshay1", "abhi1", "virginia1", "nymphia1", "sonu1", "navil1" };
            string[] clientIds = { "prasad123", "akshay123", "abhi123", "virginia123", "nymphia123", "sonu123", "navil123" };

            for (int i = 0; i < 7; i++)
            {
                if (usrname == usernames[i] && password == passwords[i] && clientid == clientIds[i])
                {
                    isValid = true;
                    FormsAuthentication.SetAuthCookie(usrname, false);
                }
            }
            if (isValid == true) { return RedirectToAction("ATMForm", "Home"); }
            else
            {
                TempData["msg"] = "Invalid Details";
                return RedirectToAction("Index", "Home");
            }
        }
       
        public ActionResult ATMForm()
        {
            return View();
        }

        public ActionResult retrieveDetails(string value)
        {
            var context = CRMServiceConn.GetConnObject.context;
            var serviceTickets = context.new_atmSet.Where(c => c.new_name == value ).ToList();
            var jsonResult = serviceTickets.Select(results => new { city = results.new_HubCity.Name, state = results.new_State.Name, results.new_atmId });

            return Json(jsonResult, JsonRequestBehavior.AllowGet);

        }

        public ActionResult save()
        {
            Guid atmGUId = new Guid(Request.Form["atm_GUID"].ToString());
            Guid _ticketId;
            string hubCity = string.Empty;
            string hubState = string.Empty;
            string errorCode = string.Empty;
            string comments = string.Empty;

            
            errorCode = Request.Form["error_code"];
            comments = Request.Form["comments"];


            var context = CRMServiceConn.GetConnObject.context;
           
            Entity ticket = new Entity("new_atmservicetickets");

            //var atmsLast = context.new_atmSet.OrderBy(t => t.CreatedOn).Where(c => c.new_name != "").ToList();

            //string f = string.Empty;
            //foreach (var c in atmsLast)
            //{
            //    f = c.new_name;
            //}


            EntityReference _atmGUID = new EntityReference("new_atm", atmGUId);

            ticket["new_atmid"] = _atmGUID;
            //ticket["new_errorcode"] = new OptionSetValue(int.Parse(errorCode));
            ticket.Attributes["new_issuedefinition"] = comments;
           // ticket.Attributes["new_name"] = "1234";

            _ticketId = CRMServiceConn.GetConnObject.service.Create(ticket);
            string ticketReference = string.Empty;
            var serviceTickets1 = context.new_atmserviceticketsSet.Where(c => c.Id == _ticketId).ToList();

            var jsonResult = serviceTickets1.Select(results => new { ticket = results.new_name });

            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home");
        }
        public long Counter()
        {
            counter = counter + 1;
            return counter;
        }
    }
}
