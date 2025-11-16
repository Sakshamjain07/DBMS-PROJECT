# app/chatbot/tools.py

from sqlalchemy.orm import Session
from app.crud import crud_order, crud_product, crud_dashboard # <-- IMPORT CRUD_DASHBOARD
from app.models import model

# --- Tool Functions ---

def get_user_profile(db: Session, current_user: model.User):
    """Fetches the profile information for the currently logged-in user."""
    return {"id": current_user.id, "email": current_user.email}

def get_last_order(db: Session, current_user: model.User):
    """Retrieves the details of the most recent order for the currently logged-in user."""
    last_order = crud_order.get_most_recent_order_by_user(db, user_id=current_user.id)
    if not last_order:
        return "You have no past orders."
    return {
        "order_id": last_order.id,
        "order_date": last_order.order_date.strftime("%Y-%m-%d"),
        "total_items": len(last_order.items)
    }

def get_product_details(db: Session, product_name: str):
    """Finds a product by its name and returns its details like price and stock quantity."""
    product = crud_product.get_product_by_name(db, name=product_name)
    if not product:
        return f"Sorry, I could not find a product named '{product_name}'."
    return {
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "quantity_in_stock": product.quantity
    }

# --- NEW TOOL FUNCTION ---
def study_data(db: Session, current_user: model.User):
    """
    Analyzes the inventory and returns key performance indicators (KPIs).
    Use this when the user asks for a summary, analysis, report, or to 'study the data'.
    """
    # This function reuses the exact same logic as our dashboard!
    kpis = crud_dashboard.get_dashboard_kpis(db)
    return kpis

# --- MODIFIED CAPABILITIES FUNCTION ---
def get_capabilities(db: Session, current_user: model.User):
    """
    Provides a summary of all the assistant's capabilities.
    This should be called when the user asks for help or says hello.
    """
    return (
        "I am your inventory assistant. I can help you with the following tasks:\n"
        "- **Get Your Profile:** Ask 'What is my email?'\n"
        "- **Check Last Order:** Ask 'Tell me about my last order.'\n"
        "- **Find Product Info:** Ask 'What is the price of the Super Widget?'\n"
        "- **Study Your Data:** Ask 'Give me a summary of the inventory.' or 'Study my data.'"
    )

# --- Tool Definitions for the AI (Updated) ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_capabilities",
            "description": "Explains what the assistant can do. Use this when the user greets you, asks for help, or asks what you can do.",
        },
    },
    # --- ADD THE NEW TOOL DEFINITION ---
    {
        "type": "function",
        "function": {
            "name": "study_data",
            "description": "Analyzes the inventory and returns key performance indicators (KPIs) like total inventory value and low stock item counts.",
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_profile",
            "description": "Get the profile information of the current user, like their email.",
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_last_order",
            "description": "Get the most recent order details for the current user.",
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_product_details",
            "description": "Get information about a specific product, such as its price and stock level.",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string",
                        "description": "The name of the product to look up, e.g., 'Test Widget'",
                    }
                },
                "required": ["product_name"],
            },
        },
    }
]

# --- ADD THE NEW FUNCTION TO THE MAPPING ---
available_tools = {
    "get_capabilities": get_capabilities,
    "study_data": study_data, # Add the new function here
    "get_user_profile": get_user_profile,
    "get_last_order": get_last_order,
    "get_product_details": get_product_details,
}
# --- MODIFIED CAPABILITIES FUNCTION ---
def get_capabilities(db: Session, current_user: model.User):
    """
    Provides a structured, numbered list of the assistant's main capabilities.
    This should be called when the user asks for help or says hello.
    """
    # Return a structured list that can be easily parsed.
    return [
        {"option": 1, "description": "Get Your Profile Information", "tool_name": "get_user_profile"},
        {"option": 2, "description": "Check Your Last Order", "tool_name": "get_last_order"},
        {"option": 3, "description": "Find Product Information", "tool_name": "get_product_details"},
        {"option": 4, "description": "Study Inventory Data (KPIs)", "tool_name": "study_data"}
    ]

# ... (keep all other tool functions: study_data, get_user_profile, etc.) ...

# --- Tool Definitions for the AI (No changes needed here, but ensure 'get_capabilities' is present) ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_capabilities",
            "description": "Presents a numbered menu of all available actions to the user. Use this when the user greets you or asks for help.",
        },
    },
    # ... (all other tool definitions remain the same) ...
]

# ... (the 'available_tools' mapping also remains the same) ...