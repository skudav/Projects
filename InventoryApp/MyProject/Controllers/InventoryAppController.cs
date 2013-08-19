using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Helpers;
using System.Web.Security;
using System.Text;
using System.Web.UI.WebControls;
namespace InventoryApp.Controllers
{
    public class InventoryAppController : Controller
    {
        //
        // GET: /InventoryApp/
        string filename;
        [Authorize]
        public ActionResult Index()
        {

            return View();
        }
        public ActionResult Login()
        {
            if (Request.IsAuthenticated)
            {
                return RedirectToAction("Search", "InventoryApp");
            }
            else
            {
                ViewData["invalid"] = TempData["msg"];
                return View();
            }
        }

        public ActionResult MasterSearch()
        {
            return View();
        
        }

        public ActionResult StoreSearch()
        {
            return View();

        }

        public ActionResult DeliveryChallan()
        {
            return View();

        }
        [HttpPost]
        public ActionResult Authentic()
        {
            // int i = 0;
            string name = string.Empty;
            string password = string.Empty;
            bool isValid = false;
            //string[] users = { "prasad", "akshay", "sonu", "rushi", "nymphia", "virginia", "navil" };
            //string[] passes = { "prasad1", "akshay1", "sonu1", "rushi1", "nymphia1", "virginia1", "navil1" };

            name = Request["fname"].ToString();
            password = Request["password"].ToString();

            if (!Roles.RoleExists("Admin"))
                Roles.CreateRole("Admin");
            if (!Roles.RoleExists("User"))
                Roles.CreateRole("User");

            //bool isauthenticated = Webservice call to authenticate the User which returns roles

            //if(isauthenticated)
            if (name == "akshay" && password == "akshay1")
            {
                FormsAuthentication.SetAuthCookie(name, false);
                ///write code to add roles retrieved with above web service call, with the User authenticated.
                //if (!Roles.RoleExists("User"))
                //{
                //  Roles.AddUserToRole(name, "User");
                // }
                //if (!Roles.RoleExists("Admin"))
                //{
                
                Roles.AddUserToRole(name, "Admin");
                //}

                isValid = true;
                filename = AppDomain.CurrentDomain.BaseDirectory + "App_Start\\" + "logErrors.txt";
                var sw = new System.IO.StreamWriter(filename, true);
                sw.WriteLine(DateTime.Now.ToString() + "User Authenticated ");
                sw.Close();
            }
            else
            {
                isValid = false;

            }

            if (isValid == true)
            {
                return RedirectToAction("Search", "InventoryApp");
            }
            else
            {
                TempData["msg"] = "Invalid login Details";
                return RedirectToAction("Login", "InventoryApp");
            }
            ///Befor call services to check if User name is verified with password
            ///$$$$$$$$$$$$$$$$$$$$$$
            ///$$$$$$$$$$$$$$$$$$$$$$$$
            ///We assume he is verified...

        }

        public ActionResult Error()
        {
            return View();
        }
        
        [Authorize(Roles = "Admin")]
        public ActionResult Business()
        {

            return View();
        }

        public ActionResult OrgInfo()
        {

            List<Models.InventoryApp> items = new List<Models.InventoryApp>();
            int orgID = 0;
            try
            {
                orgID = Convert.ToInt32(Request["text"]);
            }
            catch (Exception e)
            {
                filename = AppDomain.CurrentDomain.BaseDirectory + "App_Start\\" + "logErrors.txt";
                var sw = new System.IO.StreamWriter(filename, true);
                sw.WriteLine(DateTime.Now.ToString() + " " + e.Message + " " + e.InnerException);
                sw.Close();
            }
            items.Add(new Models.InventoryApp { itemName = Request["name"], itemId = orgID });

            //ViewBag.grid = new WebGrid(items, rowsPerPage: 4);
            return View();
        }

        public ActionResult add_Partial()
        {
            //List<Models.InventoryApp> items = new List<Models.InventoryApp>();
            //items.Add(new Models.InventoryApp { addressID = Convert.ToInt32(Request["a_id"]), addressDate = (Request["a_date"]).ToString(), addressOwnerID = Convert.ToInt32(Request["a_ownerID"]), addressCategory = Request["Department"], addressLine1 = Request["address_line1"], addressLine2 = Request["address_line2"], addressCity = Request["add_city"], addressPinCode = Convert.ToInt32(Request["add_pincode"]), addressState = Request["add_state"], addressCountry = Request["add_country"] });
            //items.Add(new Models.InventoryApp { addressID = 1, addressDate = "4/4/1990", addressOwnerID = 101, addressCategory = "Category1", addressLine1 = "uran kotnaka", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            //items.Add(new Models.InventoryApp { addressID = 2, addressDate = "8/2/1990", addressOwnerID = 102, addressCategory = "Category1", addressLine1 = "uran koliwada", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            //items.Add(new Models.InventoryApp { addressID = 3, addressDate = "12/6/1990", addressOwnerID = 103, addressCategory = "Category1", addressLine1 = "vashi", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            //items.Add(new Models.InventoryApp { addressID = 4, addressDate = "15/1/1990", addressOwnerID = 104, addressCategory = "Category1", addressLine1 = "nerul", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            //items.Add(new Models.InventoryApp { addressID = 5, addressDate = "25/3/1990", addressOwnerID = 105, addressCategory = "Category1", addressLine1 = "sanpada", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            //items.Add(new Models.InventoryApp { addressID = 6, addressDate = "8/7/1990", addressOwnerID = 106, addressCategory = "Category1", addressLine1 = "panvel", addressLine2 = "M.G.Road", addressCity = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" });
            ////ViewBag.grid = new WebGrid(items, rowsPerPage: 4 );
            List<Models.InventoryApp> items = Models.InventoryApp.getInventoryApp();
            return View(items);
        }

        public ActionResult view_entry(int id)
        {

            Models.InventoryApp items = Models.InventoryApp.getValue(id);
            // ViewBag["addressId"] = new int();
            ViewData["ID"] = items.itemSerialNo;
            ViewData["addressOwnerId"] = items.addressOwnerID;
            ViewData["addressLine1"] = items.addressLine1;
            ViewData["addressstate"] = items.addressState;
            ViewData["addressCity"] = items.partName;
            ViewData["addressCountry"] = items.addressCountry;
            ViewData["addressLine2"] = items.addressLine2;
            ViewData["addressDate"] = items.addressDate;
            ViewData["addressCategory"] = items.addressCategory;
            ViewData["addressPinCode"] = items.addressPinCode;
            //  ViewBag["addressCi"] = "h";
            return PartialView("_oneEntry", items);
        }
        public ActionResult LogOff()
        {
            string[] admins = Roles.GetUsersInRole("Admin");
            if (admins.Length != 0)
            {
                Roles.RemoveUsersFromRole(admins, "Admin");
            }
            string[] users = Roles.GetUsersInRole("User");
            if (users.Length != 0)
            {
                Roles.RemoveUsersFromRole(users, "User");
            }
            FormsAuthentication.SignOut();

            return RedirectToAction("Login", "InventoryApp");
        }

        [Authorize]
        public ActionResult Search()
        {

            return View();
        }

        public ActionResult orgForm()
        {

            return PartialView("_orgForm");
        }

        public ActionResult MasterForm()
        {

            return PartialView("_MasterForm");
        }

        public ActionResult StoreForm()
        {

            return PartialView("_StoreForm");
        }

        public ActionResult ChallanForm()
        {

            return PartialView("_ChallanForm");
        }


        public ActionResult SearchResults()
        {
            string qry = string.Empty;
            int qry_loc = 0;
            string qry_dept = string.Empty;
            //string[] organisations = {"DSMINDIA PVT LTD","HP ORGANISATION","WELSPUN PVT LTD","SONY","SAMSUNG","NOKIA", "ACCENTURE", "INFOSYS", "WIPRO","MICROMAX"};
            List<Models.InventoryApp> all_orgs = Models.InventoryApp.getOrganisations();
            qry = Request["search_part"].ToString();


            qry_dept = Request["search_model"].ToString();
            qry_dept = qry_dept.ToLower();
            List<Models.InventoryApp> results = new List<Models.InventoryApp>();

            for (int i = 0; i < 10; i++)
            {

                if (all_orgs[i].itemName.Contains(qry) && all_orgs[i].modelNo.Contains(qry_dept))
                {
                    ViewData["qry"] = qry;
                    ViewData["results"] = "not null";
                    results.Add(all_orgs[i]);
                }
            }
            return View(results);
        }


        public ActionResult view_org()
        {
            int id = Convert.ToInt32(Request["id"]);
            Models.InventoryApp items = Models.InventoryApp.getOrg(id);

            // ViewData["org_id"] = items.orgId;


            Models.InventoryApp searchResults = Models.InventoryApp.getOrg(id);

            return PartialView("_orgForm", searchResults);
        }


        public ActionResult contactRetrieve()
        {
            int id = 0;
            try
            {
                id = Convert.ToInt32(Request["id"]);
            }
            catch (Exception e) { }
            List<Models.InventoryApp> results = Models.InventoryApp.getContact(id);

            return PartialView("_contactRetrieve", results);
        }
        
        [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult DeleteContact(int id)
        {

            bool searchResults = Models.InventoryApp.delContact(id);

            var myData = new[] { new { id = 1, name = searchResults } };
            return Json(myData, JsonRequestBehavior.AllowGet);


        }


        public ActionResult auto(string q)
        {

            q = q.ToLower().Trim();
            var searchResults = Models.InventoryApp.getList();

            //var myItem = searchResults.Find(item => item.name.Contains(q));


            var jsonResult = searchResults.Where(results => results.name.ToLower().StartsWith(q)).Select(results => new { id = results.id, name = results.name });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public ActionResult city(string q)
        {

            q = q.ToLower().Trim();
            var searchResults = Models.InventoryApp.getCity();

            //var myItem = searchResults.Find(item => item.name.Contains(q));


            var jsonResult = searchResults.Where(results => results.cityname.ToLower().StartsWith(q)).Select(results => new { id = results.cityid, name = results.cityname });
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
    }
}
