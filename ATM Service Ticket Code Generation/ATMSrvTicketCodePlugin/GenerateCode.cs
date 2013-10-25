using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Services.Utility;
using System.ServiceModel;
using Microsoft.Xrm;
using System.Diagnostics;
using System.Linq;
using Microsoft.Xrm.Sdk.Query;

namespace ATMSrvTicketCodePlugin
{


    public class GenerateCode : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // get the required interfaces from the service provider
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            // CRM 2011: Microsoft.Crm.Sdk.IPluginExecutionContext -> Microsoft.Xrm.Sdk.IPluginExecutionContext
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            Entity targetEntity = null;  // CRM 2011: Microsoft.Crm.Sdk.DynamicEntity -> Microsoft.Xrm.Sdk.Entity

            #region Check if AtmServiceTicket is created
            // Check if the input parameters property bag contains a target
            // of the create operation and that target is of type Entity.
            // Verify that the entity represents our custom entity AtmServiceTicket.
            if (context.InputParameters.Contains("Target") &&
              context.InputParameters["Target"] is Entity)
            {
                // Obtain the target business entity from the input parmameters.
                targetEntity = (Entity)context.InputParameters["Target"];

                
                if (targetEntity.LogicalName != "new_atmservicetickets")
                {
                    return;
                }
            }
            else
            {
                return;
            }
            #endregion

            try
            {
                IOrganizationService service = factory.CreateOrganizationService(context.UserId);
                // CRM 2011: Microsoft.Crm.Sdk.ICrmService -> Microsoft.Xrm.Sdk.IOrganizationService
                QueryExpression ServiceTicketCounterQuery = new QueryExpression
                {
                    EntityName = "new_atmticktecounter",
                    ColumnSet = new ColumnSet("new_atmticktecounterid", "new_counter", "new_ctdate"),
                    Criteria = new FilterExpression
                    {
                        Conditions = 
                        {
                            new ConditionExpression 
                            {
                                AttributeName = "new_name",
                                Operator = ConditionOperator.Equal,
                                Values = { "TC1" }
                            }
                        }
                    }
                };

                DataCollection<Entity> ATMCounterEntity = service.RetrieveMultiple(
                    ServiceTicketCounterQuery).Entities;
                // Get the counter information
                Entity atmticketcounter = ATMCounterEntity[0];
                int counter = ((int)atmticketcounter["new_counter"]);
                DateTime counterdate = ((DateTime)atmticketcounter["new_ctdate"]).ToLocalTime();;
                string id = string.Empty;

                if (counterdate.Date == DateTime.Today.Date)
                {
                    counter = ++counter;   
                }
                else
                {
                    counter = 1;
                    counterdate = DateTime.Today.Date;
                    atmticketcounter.Attributes["new_ctdate"] = counterdate;
                }

                id = DateTime.Today.ToString("yyyyMMdd") + counter.ToString("0000");
                atmticketcounter.Attributes["new_counter"] = counter;
                
                targetEntity.Attributes.Add("new_name", id);
               service.Update(atmticketcounter);

                // Add bodyfatPercentage to target
               
            }
            catch (FaultException<OrganizationServiceFault> ex)
            // CRM 2011: System.Web.Services.Protocols.SoapException -> System.ServiceModel.FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>
            {
                throw new InvalidPluginExecutionException(String.Concat("An OrganizationServiceFault occurred in the Generate Code plug-in.", ex.Message, Environment.NewLine, ex.StackTrace));
                // CRM 2011: Microsoft.Crm.Sdk.InvalidPluginExecutionException -> Microsoft.Xrm.Sdk.InvalidPluginExecutionException
            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(String.Concat("An error occurred in the Generate Code plug-in", ex.Message, Environment.NewLine, ex.StackTrace));
                // CRM 2011: Microsoft.Crm.Sdk.InvalidPluginExecutionException -> Microsoft.Xrm.Sdk.InvalidPluginExecutionException
            }




        }

        
    }
}
