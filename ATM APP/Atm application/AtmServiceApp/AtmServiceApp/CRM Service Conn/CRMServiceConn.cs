using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;
using System.ServiceModel.Description;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace AtmServiceApp.CRMService
{
    public sealed class CRMServiceConn
    {

            // .NET guarantees thread safety for static initialization
            private static CRMServiceConn connObject = null;
            public xrmdemo5 context { get; set; }
            public IOrganizationService service { get; set; }
            //variables required via sushil method..may be all props are not required
            //public OrganizationServiceProxy OrgService { get; set; }
            //private OrganizationDetail CurrentOrganizationDetail { get; set; }
            //private IDiscoveryService DiscoveryService { get; set; }

            //private ClientCredentials _ClientCreds { get; set; }
            //private ClientCredentials _DeviceCreds { get; set; }
           // private bool IsLiveID { get; set; }

            static CRMServiceConn()
            { }

            //connecting via sushil method working
            //private CRMServiceConn()
            //{              
            //    var discoUri = GetDiscoveryServiceUri("https://disco.crm5.dynamics.com");
            //    IServiceConfiguration<IDiscoveryService> dinfo = ServiceConfigurationFactory.CreateConfiguration<IDiscoveryService>(discoUri);
            //    _ClientCreds = new ClientCredentials();
            //    //_ClientCreds.UserName.UserName = "sawantabhishek@testingdsm.onmicrosoft.com";
            //    //_ClientCreds.UserName.Password = "Dsmindia@1234";
            //    _ClientCreds.UserName.UserName = "navil@testdsm.onmicrosoft.com";
            //    _ClientCreds.UserName.Password = "nevkid@123";
            //    _DeviceCreds = DeviceIdManager.LoadOrRegisterDevice();
            //    DiscoveryServiceProxy dsp = new DiscoveryServiceProxy(discoUri, null, _ClientCreds, _DeviceCreds);

            //    dsp.Authenticate();
            //    var orgRequest = new RetrieveOrganizationsRequest();
            //    var orgResponse = dsp.Execute(orgRequest) as RetrieveOrganizationsResponse;
            //    //comboOrgs.DataSource = orgResponse.Details;
            //    //comboOrgs.DisplayMember = "FriendlyName";
            //    //comboOrgs.ValueMember = "UrlName";


            //    foreach (var resp in orgResponse.Details)
            //    {
            //     //   if (resp.UniqueName == "testingdsm"
            //            if (resp.UniqueName == "testdsm")
                        
            //        {
            //            this.CurrentOrganizationDetail = resp as OrganizationDetail;
            //            Uri orgServiceUri = new Uri(CurrentOrganizationDetail.Endpoints[EndpointType.OrganizationService]);
            //            OrgService = new OrganizationServiceProxy(orgServiceUri, null, _ClientCreds, _DeviceCreds);
            //        }
            //    }

            //}

            // Lock synchronization object

            //connecting via prasads method a context is created...
            private CRMServiceConn()
            {
                ClientCredentials credentials = new ClientCredentials();
                //When creating a CRM online trial version, through Microsoft Online services you will setup a username and password  
                credentials.UserName.UserName = "navil@testdsm.onmicrosoft.com";
                credentials.UserName.Password = "nevkid@123";

                OrganizationServiceProxy orgProxy = new OrganizationServiceProxy(
                    //new Uri("https://testdsm.api.crm5.dynamics.com/XRMServices/2011/Organization.svc"),
                new Uri("https://testdsm.api.crm5.dynamics.com/XRMServices/2011/Organization.svc"),
                null,
                credentials, null);

                orgProxy.EnableProxyTypes();
                orgProxy.Authenticate();
                service = (IOrganizationService)orgProxy;
                context = new xrmdemo5(service);

            }
            private static object syncLock = new object();

            public static CRMServiceConn GetConnObject
            {
                get
                {
                    // Support multithreaded applications through
                    // 'Double checked locking' pattern which (once
                    // the instance exists) avoids locking each
                    // time the method is invoked
                    lock (syncLock)
                    {
                        if (CRMServiceConn.connObject == null)
                            CRMServiceConn.connObject = new CRMServiceConn();

                        return CRMServiceConn.connObject;
                    }
                }
            }


        #region Private Helper Functions
            private Uri GetDiscoveryServiceUri(string serverName)
            {
                string discoSuffix = @"/XRMServices/2011/Discovery.svc";

                return new Uri(string.Format("{0}{1}", serverName, discoSuffix));
            }
            private AuthenticationProviderType GetServerType(Uri uri)
            {
                return ServiceConfigurationFactory.CreateConfiguration<IDiscoveryService>(uri).AuthenticationType;
            }
        #endregion



    }
}
