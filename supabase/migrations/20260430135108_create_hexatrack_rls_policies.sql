/*
  # HexaTrack Finance App - RLS Policies (Part 2)

  Enables RLS and creates policies for all tables.
  All policies are restrictive and scoped to authenticated users.
*/

-- ENABLE RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- CATEGORIES
CREATE POLICY "Users can select own categories" ON categories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- SUBCATEGORIES
CREATE POLICY "Users can select own subcategories" ON subcategories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subcategories" ON subcategories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subcategories" ON subcategories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own subcategories" ON subcategories FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- TAGS
CREATE POLICY "Users can select own tags" ON tags FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON tags FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON tags FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON tags FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- TRANSACTIONS
CREATE POLICY "Users can select own transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- TRANSACTION TAGS
CREATE POLICY "Users can select own transaction_tags" ON transaction_tags FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM transactions t WHERE t.id = transaction_id AND t.user_id = auth.uid()));
CREATE POLICY "Users can insert own transaction_tags" ON transaction_tags FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM transactions t WHERE t.id = transaction_id AND t.user_id = auth.uid()));
CREATE POLICY "Users can delete own transaction_tags" ON transaction_tags FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM transactions t WHERE t.id = transaction_id AND t.user_id = auth.uid()));

-- RECURRING ITEMS
CREATE POLICY "Users can select own recurring_items" ON recurring_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring_items" ON recurring_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recurring_items" ON recurring_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recurring_items" ON recurring_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- GROUPS
CREATE POLICY "Members can view their groups" ON groups FOR SELECT TO authenticated
  USING (auth.uid() = created_by OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid()));
CREATE POLICY "Users can create groups" ON groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update groups" ON groups FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can delete groups" ON groups FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- GROUP MEMBERS
CREATE POLICY "Group members can view members" ON group_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm2 WHERE gm2.group_id = g.id AND gm2.user_id = auth.uid()))));
CREATE POLICY "Group creators can insert members" ON group_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND g.created_by = auth.uid()));
CREATE POLICY "Group creators can delete members" ON group_members FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND g.created_by = auth.uid()));

-- GROUP EXPENSES
CREATE POLICY "Group members can view group expenses" ON group_expenses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));
CREATE POLICY "Group members can insert group expenses" ON group_expenses FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));
CREATE POLICY "Group members can update group expenses" ON group_expenses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));
CREATE POLICY "Group members can delete group expenses" ON group_expenses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));

-- GROUP EXPENSE SPLITS
CREATE POLICY "Group members can view expense splits" ON group_expense_splits FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM group_expenses ge JOIN groups g ON g.id = ge.group_id WHERE ge.id = expense_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));
CREATE POLICY "Group members can insert expense splits" ON group_expense_splits FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM group_expenses ge JOIN groups g ON g.id = ge.group_id WHERE ge.id = expense_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));
CREATE POLICY "Group members can update expense splits" ON group_expense_splits FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM group_expenses ge JOIN groups g ON g.id = ge.group_id WHERE ge.id = expense_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM group_expenses ge JOIN groups g ON g.id = ge.group_id WHERE ge.id = expense_id AND (g.created_by = auth.uid() OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = g.id AND gm.user_id = auth.uid()))));

-- USER SETTINGS
CREATE POLICY "Users can select own settings" ON user_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

