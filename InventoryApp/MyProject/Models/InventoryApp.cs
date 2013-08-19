using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventoryApp.Models
{
    public class InventoryApp
    {

        public int itemId { get; set; }
        public int orgCreatedon { get; set; }
        public string itemName { get; set; }
        public string modelNo { get; set; }
        public int orgAddId { get; set; }
        public int assetCode { get; set; }
        public string orgContact { get; set; }
        public string orgSecContact { get; set; }
        public int itemSerialNo { get; set; }
        public string addressDate { get; set; }
        public int addressOwnerID { get; set; }
        public string addressCategory { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string partName { get; set; }
        public int addressPinCode { get; set; }
        public string addressState { get; set; }
        public string addressCountry { get; set; }

        public int cityid { get; set; }
        public string cityname { get; set; }

        public int id { get; set; }
        public string name { get; set; }


        public static List<InventoryApp> getInventoryApp()
        {
            List<InventoryApp> InventoryApp = new List<InventoryApp>()
            {
                new InventoryApp { itemSerialNo = 1, addressDate = "4/4/1990", addressOwnerID = 101, addressCategory = "Category1", addressLine1 = "uran kotnaka", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
                new InventoryApp { itemSerialNo = 2, addressDate = "8/2/1990", addressOwnerID = 102, addressCategory = "Category1", addressLine1 = "uran koliwada", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
                new InventoryApp { itemSerialNo = 3, addressDate = "12/6/1990", addressOwnerID = 103, addressCategory = "Category2", addressLine1 = "vashi", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
                new InventoryApp { itemSerialNo = 4, addressDate = "15/1/1990", addressOwnerID = 104, addressCategory = "Category2", addressLine1 = "nerul", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
                new InventoryApp { itemSerialNo = 5, addressDate = "25/3/1990", addressOwnerID = 105, addressCategory = "Category1", addressLine1 = "sanpada", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
                new InventoryApp { itemSerialNo = 6, addressDate = "8/7/1990", addressOwnerID = 106, addressCategory = "Category1", addressLine1 = "panvel", addressLine2 = "M.G.Road", partName = "Navi mumbai", addressPinCode = 400705, addressState = "Maharashtra", addressCountry = "India" },
            };
            return InventoryApp;
        }

        public static List<InventoryApp> getList()
        {
            List<InventoryApp> InventoryApp = new List<InventoryApp>()
            {
                new InventoryApp { id = 1, name = "ActionScript" },
                new InventoryApp { id = 2, name = "Ajax" },
                new InventoryApp { id = 3, name = "PHP" },
                new InventoryApp { id = 4, name = "Flash" },
                new InventoryApp { id = 5, name = "C++" },
                new InventoryApp { id = 6, name = "JavaScript"},
                new InventoryApp { id = 7, name = "Java"},
              
            };
            return InventoryApp;
        }
        public static InventoryApp getValue(int d)
        {
            List<InventoryApp> it = Models.InventoryApp.getInventoryApp();
            InventoryApp m;
            m = it.Find(item => item.itemSerialNo > (d - 1));
            return m;
        }

        //public static InventoryApp getValueList(string d)
        //{
        //    List<InventoryApp> it = Models.InventoryApp.getList();
        //    //InventoryApp m;
        //    //m = it.Find(item => item.itemSerialNo > (d - 1));
        //    List<InventoryApp> itt = new List<InventoryApp>();

        //    itt = it.Where(i => i.name.Contains(d));
        //    return itt;
        //}

        public static List<InventoryApp> getOrganisations()
        {
            List<InventoryApp> orgs = new List<InventoryApp>()
            {
                new InventoryApp { itemName = "mouse", assetCode = 301, modelNo = "M-0025", itemId = 101, itemSerialNo = 201201,partName = "part1"},
                new InventoryApp { itemName = "keyboard", assetCode = 302, modelNo = "M-0025", itemId = 102 , itemSerialNo = 202202, partName = "part2"},
                new InventoryApp { itemName = "motherBoard", assetCode = 303, modelNo = "M-0025", itemId = 103,  itemSerialNo = 203203, partName = "part3"},
                new InventoryApp { itemName = "processor", assetCode = 304, modelNo = "M-0025", itemId = 104, itemSerialNo = 204204 ,partName = "part4"},
                new InventoryApp { itemName = "cd drive", assetCode = 305, modelNo = "M-0025", itemId = 105, itemSerialNo = 205205 , partName ="part5"},
                new InventoryApp { itemName = "pen drive", assetCode = 306, modelNo = "M-0025", itemId = 106, itemSerialNo = 201206,partName = "part6"},
                new InventoryApp { itemName = "desktop", assetCode = 307, modelNo = "M-0025", itemId = 107 , itemSerialNo = 202207, partName = "part7"},
                new InventoryApp { itemName = "phone", assetCode = 308, modelNo = "M-0025", itemId = 108,  itemSerialNo = 203208, partName = "part8"},
                new InventoryApp { itemName = "head phone", assetCode = 309, modelNo = "M-0025", itemId = 109, itemSerialNo = 204209 ,partName = "part9"},
                new InventoryApp { itemName = "cpu", assetCode = 310, modelNo = "M-0025", itemId = 110, itemSerialNo = 205210 , partName ="part10"},
            };
            return orgs;
        }
        public static List<InventoryApp> allContacts()
        {
            List<InventoryApp> orgs = new List<InventoryApp>()
            {
                new InventoryApp { itemId = 103, assetCode = 201, orgContact = "Prasad", orgSecContact = "Thakur" },
                new InventoryApp { itemId = 102, assetCode = 202, orgContact = "Akshay", orgSecContact = "Koli" },
                new InventoryApp { itemId = 101, assetCode = 203, orgContact = "Virginia", orgSecContact = "Nadar" },
                new InventoryApp { itemId = 104, assetCode = 204, orgContact = "Nymphia", orgSecContact = "Pereira" },
                new InventoryApp { itemId = 105, assetCode = 205, orgContact = "Sonu", orgSecContact = "Pangotra" },
                new InventoryApp { itemId = 105, assetCode = 206, orgContact = "Navil", orgSecContact = "Fernandes" },
                new InventoryApp { itemId = 106, assetCode = 201, orgContact = "Pratik", orgSecContact = "Thakur" },
                new InventoryApp { itemId = 107, assetCode = 202, orgContact = "Akshay", orgSecContact = "Koli" },
                new InventoryApp { itemId = 108, assetCode = 203, orgContact = "Francis", orgSecContact = "Nadar" },
                new InventoryApp { itemId = 109, assetCode = 204, orgContact = "Bon", orgSecContact = "Pereira" },
                new InventoryApp { itemId = 110, assetCode = 205, orgContact = "Amit", orgSecContact = "Pangotra" },
                new InventoryApp { itemId = 108, assetCode = 206, orgContact = "Victor", orgSecContact = "Fernandes" },
            };
            return orgs;
        }


        public static List<InventoryApp> getContact(int d)
        {
            List<InventoryApp> orgs = Models.InventoryApp.allContacts();
            List<InventoryApp> orgsFind = new List<InventoryApp>();
            for (int i = 0; i < 11; i++)
            {
                if (orgs[i].itemId == (d))
                {
                    orgsFind.Add(orgs[i]);
                }
            }

            return orgsFind;
        }


        public static InventoryApp getOrg(int d)
        {
            List<InventoryApp> it = Models.InventoryApp.getOrganisations();
            InventoryApp m;
            m = it.Find(item => item.itemId > (d - 1));
            return m;
        }

        public static Boolean delContact(int d)
        {
            List<InventoryApp> orgs = Models.InventoryApp.allContacts();

            bool retValue = false;
            //List<InventoryApp> orgsFind = new List<InventoryApp>();
            for (int i = 0; i < orgs.Count; i++)
            {
                if (orgs[i].assetCode == (d))
                {
                    orgs.Remove(orgs[i]);
                    retValue = true;
                }
            }

            return retValue;
        }

        public static List<InventoryApp> getCity()
        {
            List<InventoryApp> InventoryApp = new List<InventoryApp>()
            {
                new InventoryApp { cityid = 1, cityname = "Hyderabad" },
                new InventoryApp { cityid = 2, cityname = "Itanagar" },
                new InventoryApp { cityid = 3, cityname = "Dispur" },
                new InventoryApp { cityid = 4, cityname = "Patna" },
                new InventoryApp { cityid = 5, cityname = "Raipur" },
                new InventoryApp { cityid = 6, cityname = "Panaji"},
                new InventoryApp { cityid = 7, cityname = "Gandhinagar"},
                new InventoryApp { cityid = 8, cityname = "Chandigarh" },
                new InventoryApp { cityid = 9, cityname = "Shimla" },
                new InventoryApp { cityid = 10, cityname = "Ranchi" },
                new InventoryApp { cityid = 11, cityname = "Bangalore" },
                new InventoryApp { cityid = 12, cityname = "Bhopal" },
                new InventoryApp { cityid = 13, cityname = "Mumbai" },
                new InventoryApp { cityid = 14, cityname = "Shillong"},
              
            };
            return InventoryApp;
        }

    }
}